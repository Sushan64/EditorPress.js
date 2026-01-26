import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
    ImagePlus,
    Globe,
    ImageIcon,
    ChevronDown,
    X,
    CloudUpload,
    Upload,
} from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import{
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


function ImageDialog({editor, children}) {
    
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
    const [url, setUrl] = useState("");
    const [alt, setAlt] = useState("");
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (isImageDialogOpen) {
            setActiveTab("upload");
            setUrl("");
            setAlt("");
            setCaption("");
            setFile(null);
            setDragOver(false);
            setShowAdvanced(false);
        }
    }, [isImageDialogOpen]);

    const handleSubmit = () => {
      if (activeTab === "upload" && file) {
        const url = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: url }).run()
      } else if (activeTab === "url" && url.trim()) {
        editor.chain().focus().setImage({ src: url.trim() }).run()
      }
      setIsImageDialogOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (activeTab === "url" ? url.trim() : file)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0]) {
            setFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && files[0]) {
            setFile(files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Check if we have valid content to show advanced options
    const hasValidContent = activeTab === "upload" ? !!file : !!url.trim();

    return (
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            {children}
          </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        <DialogTitle>Insert Image</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value: string) =>
                            setActiveTab(value as "upload" | "url")
                        }
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="upload"
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload
                            </TabsTrigger>
                            <TabsTrigger
                                value="url"
                                className="flex items-center gap-2"
                            >
                                <Globe className="h-4 w-4" />
                                URL
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Upload Image</Label>
                                {!file ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                                            dragOver
                                                ? "border-primary bg-primary/5"
                                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <CloudUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drop an image here, or click to
                                            select
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Supports: JPG, PNG, GIF, WebP (max
                                            10MB)
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(
                                                        file.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="url" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                    id="image-url"
                                    type="url"
                                    required={true}
                                    placeholder="https://example.com/image.jpg"
                                    value={url}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setUrl(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </TabsContent>

                        {/* Advanced Options - only show when we have valid content */}
                        {hasValidContent && (
                            <Collapsible
                                open={showAdvanced}
                                onOpenChange={setShowAdvanced}
                                className="mt-4"
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full justify-between p-2 h-auto"
                                    >
                                        <span className="text-sm font-medium">
                                            Advanced Options
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                showAdvanced ? "rotate-180" : ""
                                            }`}
                                        />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="image-alt">
                                            Alt Text (optional)
                                        </Label>
                                        <Input
                                            id="image-alt"
                                            placeholder="Describe the image for accessibility"
                                            value={alt}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setAlt(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image-caption">
                                            Caption (optional)
                                        </Label>
                                        <Input
                                            id="image-caption"
                                            placeholder="Image caption"
                                            value={caption}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => setCaption(e.target.value)}
                                        />
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </Tabs>
                </div>

                <DialogFooter>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsImageDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                activeTab === "upload" ? !file : !url.trim()
                            }
                        >
                            Insert Image
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default memo(ImageDialog)

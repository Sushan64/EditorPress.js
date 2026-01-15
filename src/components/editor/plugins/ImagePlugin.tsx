import React, { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../nodes/ImageNode.tsx";
import { $insertNodes } from "lexical";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

export default function ImagePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    let src = "";
    if (url) src = url;
    if (file) src = URL.createObjectURL(file);

    editor.update(() => {
      const node = $createImageNode({ src, altText: "Dummy text" });
      $insertNodes([node]);
    });
    setFile(undefined);
    setURL("");
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        aria-label="Add Image"
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <ImagePlus/>
      </Button>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
          }
          e.target.files = null;
        }}
      />
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={()=>{setIsOpen(false)}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <Input
              value={url}
              onChange={(e)=>{setURL(e.target.value)}}
              placeholder="Add Image URL"
              />
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => inputRef?.current?.click()}
                >
                {file ? file.name : "Upload Image"}
            </Button>
            <DialogFooter>
            <Button
              variant="ghost" 
              disabled={!url && !file}
              onClick={onAddImage}
              >
              Add Image
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
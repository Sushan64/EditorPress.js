import { memo } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Ellipsis, Table, ImagePlus, SquareChevronRight } from "lucide-react";
import TablePopover from "../TablePopover.tsx";
import ImageDialog from "../ImageDialog.tsx";
import { ListButtons, TextAlignmentButtons } from "../ToolbarMenu.tsx";

function MobileOnlyMoreOption({ editor, editorState }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent transition-colors"
                    aria-label="More options"
                >
                    <Ellipsis className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="bottom"
                className="data-[side=bottom]:max-h-[75vh] rounded-t-2xl border-t"
            >
                <SheetHeader className="pb-4 border-b">
                    <SheetTitle className="text-lg font-semibold">
                        More Options
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                        Add blocks and format your content
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 px-4 space-y-6">
                    {/* Insert Block Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Insert Block
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <TablePopover editor={editor}>
                                <Button
                                    variant="outline"
                                    className={
                                        editorState.isTable ? "bg-muted" : ""
                                    }
                                >
                                    <Table /> Table
                                </Button>
                            </TablePopover>

                            <ImageDialog editor={editor}>
                                <Button variant="outline">
                                    <ImagePlus /> Image
                                </Button>
                            </ImageDialog>

                            <div className="inline-flex items-center gap-2 h-fit rounded-md border border-input bg-background pr-3 hover:bg-accent transition-colors">
                                <ListButtons
                                    editor={editor}
                                    editorState={editorState}
                                    size="default"
                                />
                                <span className="text-sm font-medium">
                                    List
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleCodeBlock()
                                        .run()
                                }
                                className={
                                    editorState.isCodeBlock && "bg-muted"
                                }
                            >
                                <SquareChevronRight /> Code Block
                            </Button>
                        </div>
                    </div>

                    {/* Formatting Options Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Formatting
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="text-xs font-medium text-muted-foreground mb-2">
                                    Alignment
                                </div>
                                <TextAlignmentButtons
                                    editor={editor}
                                    editorState={editorState}
                                    size="default"
                                />
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="text-xs font-medium text-muted-foreground mb-2">
                                    Block Format
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default memo(MobileOnlyMoreOption);

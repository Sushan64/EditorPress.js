import React, {useMemo, useEffect} from "react";
import { useEditorState } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Bold,
    Italic,
    Underline,
    Code,
    Strikethrough,
    Subscript,
    ChevronDown,
    Superscript,
    Undo,
    Redo,
    Table,
    Trash2,
    Link2,
    Link2Off,
    Save,
    List,
    ListOrdered,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
    ImagePlus,
    SquareChevronRight,
} from "lucide-react";
import LinkPopover from "./LinkPopover.tsx";
import HeadingSelect from "./HeadingSelect.tsx";
import FontSizeSelect from "./FontSizeSelect.tsx";
import TablePopover from "./TablePopover.tsx";
import ImageDialog from "./ImageDialog.tsx";
import MoreOptions from "./mobileOnly/MoreOptions.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { toast } from "sonner";
import { useDebouncedCallback } from 'use-debounce';

export function ListButtons({ editor, editorState, size = "sm" }) {
    return (
        <ButtonGroup>
            <Button
                variant="outline"
                size={size}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editorState.isBulletList ? "bg-muted" : ""}
            >
                <List />
            </Button>
            <Button
                variant="outline"
                size={size}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editorState.isOrderedList ? "bg-muted" : ""}
            >
                <ListOrdered />
            </Button>
        </ButtonGroup>
    );
}

export function TextAlignmentButtons({editor, editorState, size="sm" }) {
    return (
      <ButtonGroup>
            <Button
              size={size}
              variant="outline"
              onClick={()=> editor.chain().focus().toggleTextAlign('left').run()}
              className={editorState.isAlignLeft && "bg-muted"}
            >
              <TextAlignStart />
            </Button>
            <Button
              size={size}
              variant="outline"
              onClick={()=> editor.chain().focus().setTextAlign('center').run()}
              className={editorState.isAlignCenter && "bg-muted"}
            >
              <TextAlignCenter />
            </Button>
            <Button
              size={size}
              variant="outline"
              onClick={()=> editor.chain().focus().setTextAlign('right').run()}
              className={editorState.isAlignRight && "bg-muted"}
            >
              <TextAlignEnd />
            </Button>
            <Button
              size={size}
              variant="outline"
              onClick={()=> editor.chain().focus().setTextAlign('justify').run()}
              className={editorState.isAlignJustify && "bg-muted"}
            >
              <TextAlignJustify />
            </Button>
      </ButtonGroup>
    );
}

export default function ToolbarMenu({ editor }) {
    if (!editor) return null;
    const isMobile = useIsMobile();
    
    const handleSave = useDebouncedCallback(
      () => {
        localStorage.setItem('editorContent', JSON.stringify(editor.getJSON()))
        //toast.success("Content Saved!")
       },
      3000
    );
    
    useEffect(()=>{
      const updateHandler = ()=>{
        handleSave();
      }
      editor.on('update', updateHandler)
      return ()=>{
        editor.off('update', updateHandler)
      }
    }, [editor, handleSave])
    
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                canUndo: ctx.editor.can().undo(),
                canRedo: ctx.editor.can().redo(),
                isBold: ctx.editor.isActive("bold") ?? false,
                isItalic: ctx.editor.isActive("italic") ?? false,
                isUnderline: ctx.editor.isActive("underline") ?? false,
                isCode: ctx.editor.isActive("code") ?? false,
                isStrike: ctx.editor.isActive("strike") ?? false,
                isSuperscript: ctx.editor.isActive("superscript") ?? false,
                isSubscript: ctx.editor.isActive("subscript") ?? false,
                isLink: ctx.editor.isActive("link") ?? false,
                isBulletList: ctx.editor.isActive("bulletList") ?? false,
                isOrderedList: ctx.editor.isActive("orderedList") ?? false,
                isTable: ctx.editor.isActive("table") ?? false,
                isAlignLeft: ctx.editor.isActive({textAlign: "left"}) ?? false,
                isAlignCenter: ctx.editor.isActive({textAlign: "center"}) ?? false,
                isAlignRight: ctx.editor.isActive({textAlign: "right"}) ?? false,
                isAlignJustify: ctx.editor.isActive({textAlign: "justify"}) ?? false,
                isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
            };
        }
    });
    return (
        <div className="flex items-center gap-2 bg-gray-50 border-b border-gray-300 p-2 overflow-scroll">
          <Button
            variant="outline"
            size="sm"
            onClick={()=> handleSave.flush()}
          >
            <Save />
          </Button>
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editorState.canUndo}
                >
                    <Undo />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editorState.canRedo}
                >
                    <Redo />
                </Button>
            </ButtonGroup>
            <HeadingSelect editor={editor} />
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editorState.isBold ? "bg-muted" : ""}
                >
                    <Bold />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editorState.isItalic ? "bg-muted" : ""}
                >
                    <Italic />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    className={editorState.isUnderline ? "bg-muted" : ""}
                >
                    <Underline />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editorState.isCode ? "bg-muted" : ""}
                >
                    <Code />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editorState.isStrike ? "bg-muted" : ""}
                >
                    <Strikethrough />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        editorState.isSubscript &&
                            editor.commands.unsetSubscript();
                        editor.chain().focus().toggleSuperscript().run();
                    }}
                    className={editorState.isSuperscript ? "bg-muted" : ""}
                >
                    <Superscript />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        editorState.isSuperscript &&
                            editor.commands.unsetSuperscript();
                        editor.chain().focus().toggleSubscript().run();
                    }}
                    className={editorState.isSubscript ? "bg-muted" : ""}
                >
                    <Subscript />
                </Button>
            </ButtonGroup>
             {!isMobile && <FontSizeSelect editor={editor} /> }
            {editorState.isLink ? (
                <Button
                    variant="outline"
                    className="bg-muted"
                    size="sm"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .unsetLink()
                            .run()
                    }
                >
                    <Link2Off />
                </Button>
            ) : (
                <LinkPopover editor={editor}>
                    <Button variant="outline" size="sm">
                        <Link2 />
                    </Button>
                </LinkPopover>
            )}
            {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={()=>editor.chain().focus().toggleCodeBlock().run()}
              className={editorState.isCodeBlock && "bg-muted"}
            >
              <SquareChevronRight />
            </Button>
            )}
            
            {!isMobile && (
                <ListButtons editor={editor} editorState={editorState} />
            )}
            
            {!isMobile && (
              <TextAlignmentButtons editor={editor} editorState={editorState} />
            )}
            
            {!isMobile && (
            <ImageDialog editor={editor}>
              <Button
                variant="outline"
                size="sm"
              >
                <ImagePlus />
              </Button>
              </ImageDialog>
            )}
            
            {!isMobile && (
                <TablePopover editor={editor}>
                    <Button
                        variant="outline"
                        size="sm"
                        className={editorState.isTable ? "bg-muted" : ""}
                    >
                        <Table />
                    </Button>
                </TablePopover>
            )}
            {isMobile && (
                <MoreOptions editor={editor} editorState={editorState} />
            )}
        </div>
    );
}

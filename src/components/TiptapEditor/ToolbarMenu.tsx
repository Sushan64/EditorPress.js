import React from 'react'
import { useEditorState} from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
    ListOrdered
} from "lucide-react";
import LinkPopover from './LinkPopover.tsx'
import HeadingSelect from './HeadingSelect.tsx'

export default function ToolbarMenu({editor}) {
  if (!editor) return null
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        isSuperscript: ctx.editor.isActive('superscript') ?? false,
        isSubscript: ctx.editor.isActive('subscript') ?? false,
        isLink: ctx.editor.isActive('link') ?? false,
      }
    }
  })
  return (
<div className="flex items-center gap-2 bg-gray-50 border-b border-gray-300 p-2 overflow-scroll">
  <ButtonGroup>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().undo().run()}
      disabled={!editorState.canUndo}
    >
      <Undo />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().redo().run()}
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
      onClick={()=>editor.chain().focus().toggleBold().run()}
      className={editorState.isBold ? 'bg-muted': ""}
    >
      <Bold />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().toggleItalic().run()}
      className={editorState.isItalic ? 'bg-muted': ""}
    >
      <Italic />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().toggleUnderline().run()}
      className={editorState.isUnderline ? 'bg-muted': ""}
    >
      <Underline />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().toggleCode().run()}
      className={editorState.isCode ? 'bg-muted': ""}
    >
      <Code />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>editor.chain().focus().toggleStrike().run()}
      className={editorState.isStrike ? 'bg-muted': ""}
    >
      <Strikethrough />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>{
        editorState.isSubscript && editor.commands.unsetSubscript()
        editor.chain().focus().toggleSuperscript().run()
      }}
      className={editorState.isSuperscript ? 'bg-muted': ""}
    >
      <Superscript />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={()=>{
        editorState.isSuperscript && editor.commands.unsetSuperscript()
        editor.chain().focus().toggleSubscript().run()
      }}
      className={editorState.isSubscript ? 'bg-muted': ""}
    >
      <Subscript />
    </Button>
  </ButtonGroup>
  {editorState.isLink ? (
    <Button
      variant="outline"
      className="bg-muted"
      size="sm"
      onClick={()=> editor.chain().focus().extendMarkRange('link').unsetLink().run()}
    >
      <Link2Off />
    </Button>
  ):(
  <LinkPopover editor={editor}>
    <Button variant="outline" size="sm">
      <Link2 />
    </Button>
  </LinkPopover>
  )}
  </div>
  )
}
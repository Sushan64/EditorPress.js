import React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger
} from "@/components/ui/context-menu";
import { useEditorState } from "@tiptap/react";

export default function EditorContextMenu({ editor, children }) {
    if (!editor) return <>{children}</>;
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                isTable: ctx.editor.isActive("table") ?? false,
            };
        }
    });

    if (!editorState.isTable) {
        return <>{children}</>;
    }
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                {editorState.isTable && (
                    <>
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().addRowBefore().run()
                            }
                            disabled={!editor.can().addRowBefore()}
                        >
                            Add Row Before
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().addRowAfter().run()
                            }
                            disabled={!editor.can().addRowAfter()}
                        >
                            Add Row After
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().deleteRow().run()
                            }
                            disabled={!editor.can().deleteRow()}
                        >
                            Delete Row
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().addColumnBefore().run()
                            }
                            disabled={!editor.can().addColumnBefore()}
                        >
                            Add Column Before
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().addColumnAfter().run()
                            }
                            disabled={!editor.can().addColumnAfter()}
                        >
                            Add Column After
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().deleteColumn().run()
                            }
                            disabled={!editor.can().deleteColumn()}
                        >
                            Delete Column
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            onClick={() =>
                                editor.chain().focus().deleteTable().run()
                            }
                            disabled={!editor.can().deleteTable()}
                            className="text-destructive"
                        >
                            Delete Table
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}

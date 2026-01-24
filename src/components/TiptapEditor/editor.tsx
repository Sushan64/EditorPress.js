import React, { useMemo } from "react";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./ToolbarMenu.tsx";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

export default function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Superscript,
            Subscript,
            Link.configure({
                autolink: false,
                HTMLAttributes: {
                    class: "underline text-blue-500"
                }
            })
        ], // define your extension array
        content: "<p>Hello World!</p>", // initial content
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none  max-w-none px-8 py-6"
            }
        }
    });

    const providerValue = useMemo(() => ({ editor }), [editor]);

    return (
        <>
            <EditorContext.Provider value={providerValue}>
                <div className="flex-1 flex flex-col min-h-0 border border-gray-300 rounded-md bg-white overflow-hidden">
                    <Toolbar editor={editor} />
                    <div className="flex-1 min-h-0 overflow-auto p-2">
                        <EditorContent editor={editor} />
                    </div>
                    {/*
      <BubbleMenu
        editor={editor}
        className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl flex gap-1"
      >
        This is the bubble menu
      </BubbleMenu>*/}
                </div>
            </EditorContext.Provider>
        </>
    );
}

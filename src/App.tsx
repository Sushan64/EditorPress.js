import { useState } from "react";
import Editor from "@/components/TiptapEditor/editor";
import { Toaster } from "@/components/ui/sonner";
import { ToolbarContext } from "@/components/editor/context/ToolbarContext";
function App() {
    return (
      <div className="h-dvh flex flex-col bg-white">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex-shrink-0">
        <h1 className="text-gray-900 text-xl font-semibold">
          EditorPress.js
          <span className="ml-3 text-sm font-normal text-gray-600">
            by{' '}
            <a
              href="https://github.com/Sushan64"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Sushan Khatiwada
            </a>
          </span>
        </h1>
      </nav>
      
        <div className="flex-1 flex flex-col p-3 min-h-0">
        <Editor />
        </div>
      </div>
    );
}

export default App;

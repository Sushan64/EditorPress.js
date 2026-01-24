import { useState } from 'react'
import Editor  from '@/components/editor/Editor'
import { Toaster } from "@/components/ui/sonner"
import { ToolbarContext } from "@/components/editor/context/ToolbarContext"
function TempApp() {
  return (
    <>
      <nav className="fixed z-2 w-full px-5 bg-gray-500">
        <h1 className="text-white text-2xl font-semibold">EditorPress.js <span className="text-sm font-normal underline"><a href="https://github.com/Sushan64" target="_blank">- by Sushan Khatiwada</a></span></h1>
      </nav>
      <div className="h-auto min-h-dvh bg-gray-100 flex justify-center p-6">
      <ToolbarContext>
        <Editor />
      </ToolbarContext>
      </div>
      <Toaster richColors />
    </>
  )
}

export default TempApp
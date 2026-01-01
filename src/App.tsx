import { useState } from 'react'
import Editor  from '@/components/editor/Editor'
import { ToolbarContext } from "@/components/editor/context/ToolbarContext"
function App() {
  return (
    <>
      <div className="h-auto min-h-dvh bg-gray-100 flex justify-center p-6">
      <ToolbarContext>
      <Editor />
      </ToolbarContext>
      </div>
    </>
  )
}

export default App

import React, {useState} from "react";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentEditor } from '@tiptap/react'

export default function LinkPopover({editor, children}) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [link, setLink] = useState("")
  
  const handleSubmit = ()=>{
    if (link) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run()
    }else{
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLink('')
    setIsLinkOpen(false)
  }
  
    return (
        <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Insert Link</PopoverTitle>
                </PopoverHeader>
                <div className="space-y-3">
                  <Input
                    required
                    type="link"
                    value={link}
                    placeholder="https://www.example.com"
                    onChange={(e)=>setLink(e.target.value)}
                  />
                  <div className="flex gap-3 justify-center items-center">
                    <Button
                      variant="outline"
                      onClick={()=>setIsLinkOpen(false)}
                    >
                      Cancle
                    </Button>
                    <Button
                      onClick={handleSubmit}
                    >
                      Insert
                    </Button>
                  </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

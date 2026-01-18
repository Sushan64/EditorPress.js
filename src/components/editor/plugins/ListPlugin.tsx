import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import {
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  List,
  ListOrdered
} from 'lucide-react'
import { $getNearestNodeOfType } from '@lexical/utils'
import { useToolbarState} from '../context/ToolbarContext.tsx'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {Button} from '@/components/ui/button'
import {ButtonGroup} from '@/components/ui/button-group'
import { useState, useEffect, useCallback } from 'react'

export default function ListPlugin(){
  const {toolbarState, updateToolbarState} = useToolbarState()
  const [editor] = useLexicalComposerContext()
  const [activeList, setActiveList] = useState('')
  
  const $updateToolbar = useCallback(()=>{
    const selection = $getSelection();
    if ($isRangeSelection(selection)){
      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      if($isListNode(element)){
        const parentList = $getNearestNodeOfType(anchorNode, ListNode)
        const type = parentList ? parentList.getTag() : element.getTag()
        updateToolbarState('blockType', type)
      }
    }
  }, [updateToolbarState])
  
  useEffect(()=>{
    editor.registerUpdateListener(({editorState}) => {
        editorState.read(
            () => {
              $updateToolbar();
            },
            {editor},
          );
        })
  }, [editor, $updateToolbar])
  
  return(
    <>
      <ButtonGroup>
      <Button
        onClick={()=>{
          if(toolbarState.blockType === "ol"){
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          } else{
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
        }}
        size="sm"
        className={toolbarState.blockType === "ol" ? "bg-muted" : ""}
        variant="outline"
      >
        <ListOrdered />
      </Button>
      
      <Button
        onClick={()=>{
        if(toolbarState.blockType === "ul"){
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          } else{
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
        }}
        size="sm"
        variant="outline"
        className={toolbarState.blockType === "ul" ? "bg-muted": ""}
      >
        <List />
      </Button>
      </ButtonGroup>
    </>
    )
}
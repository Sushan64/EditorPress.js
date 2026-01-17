import {useState, useEffect, useCallback} from 'react'
import {
  FORMAT_ELEMENT_COMMAND,
  $isRangeSelection,
  $getSelection,
} from "lexical";
import {
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
} from 'lucide-react'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import DropDown, { DropDownItem } from "../ui/dropdown.tsx";
import { ChevronDown } from "lucide-react";

export default function TextAlignmentPlugin() {
  const [editor] = useLexicalComposerContext();
  const [textAlignment, setTextAlignment] = useState('left')
  
  const $updateToolbar = useCallback(()=>{
    const selection = $getSelection();
    if($isRangeSelection(selection)){
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementFormat = element.getFormatType();
      
      switch (elementFormat){
        case 'right':
          setTextAlignment('right')
          break
        case "center":
          setTextAlignment('center')
          break
        case "justify":
          setTextAlignment('justify')
          break
        default:
          setTextAlignment('left')
      }    
    }
  }, [])
  
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
  
  // Label on top of the button
  const currentLabel = {
    left: <TextAlignStart />,
    center: <TextAlignCenter />,
    right: <TextAlignEnd />,
    justify: <TextAlignJustify />,
  }[textAlignment] ?? "Format";

  return (
    <DropDown
      buttonLabel={currentLabel}
      buttonIconClassName={<ChevronDown className="w-4 h-4" />}
      buttonAriaLabel="Text Format"
    >
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        isActive={textAlignment === "left"}
      >
        Left Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        isActive={textAlignment === "center"}
      >
        Center Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        isActive={textAlignment === "right"}
      >
        Right Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        isActive={textAlignment === "justify"}
      >
        Justify
      </DropDownItem>
    </DropDown>
  );
}
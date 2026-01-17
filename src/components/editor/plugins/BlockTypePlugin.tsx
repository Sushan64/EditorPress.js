import {useState, useEffect, useCallback} from "react";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";

import { useToolbarState } from "../context/ToolbarContext.tsx"

import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import CodeBlockPlugin from '../plugins/CodeBlockPlugin.tsx'

import DropDown, { DropDownItem } from "../ui/dropdown.tsx";
import { ChevronDown } from "lucide-react";

export default function BlockTypePlugin() {
  const [editor] = useLexicalComposerContext();
  const {toolbarState, updateToolbarState} = useToolbarState();
  
  const $updateToolbar = useCallback(()=>{
    const selection = $getSelection()
    if($isRangeSelection(selection)){
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey()
      updateToolbarState('selectedElementKey', elementKey);
      const elementType = element.getType();
      const elementTag = element.getTag ? element.getTag() : null;
      let blockType;
      switch (elementType){
        case "heading":
          blockType = elementTag
          break
        case "quote":
          blockType = "quote"
          break
        case "list":
          blockType = element.getListType()
          break
        case "code":
          if ($isCodeNode(element)) {
          updateToolbarState('codeLanguage', element.getLanguage() || getDefaultCodeLanguage());
        }
          blockType = 'code'
          break
        default:
          blockType = "paragraph"
      }
    updateToolbarState('blockType', blockType)
    }
  }, [])
  
  
  const formatParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }, [editor]);

  const formatHeading = useCallback((tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  }, [editor]);

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }, [editor]);

  const formatCodeBlock = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
        updateToolbarState('selectedLanguage', 'javascript')
      }
    });
  }, [editor]);

  useEffect(()=>{
    editor.registerUpdateListener(({editorState}) => {
          editorState.read(
            () => {
              $updateToolbar();
            },
            {editor},
          );
        })
  }, [editor, $updateToolbar, formatParagraph, formatHeading, formatCodeBlock, formatQuote])
  
  // Label on top of the button
  const currentLabel = {
    paragraph: "Paragraph",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    quote: "Quote",
    code: "Code Block",
  }[toolbarState.blockType] ?? "Format";

  return (
    <DropDown
      buttonLabel={currentLabel}
      buttonIconClassName={<ChevronDown className="w-4 h-4" />}
      buttonAriaLabel="Block Format"
    >
      <DropDownItem
        onClick={formatParagraph}
        isActive={toolbarState.blockType === "paragraph"}
      >
        Paragraph
      </DropDownItem>
      
      {["h1", "h2", "h3", "h4", "h5", "h6"].map((heading, idx)=>(
        <DropDownItem
          key={idx}
          onClick={() => formatHeading(heading)}
          isActive={toolbarState.blockType === heading}
        >
          Heading {idx+1}
        </DropDownItem>
      ))}

      <DropDownItem
        onClick={formatQuote}
        isActive={toolbarState.blockType === "quote"}
      >
        Quote
      </DropDownItem>

      <DropDownItem
        onClick={formatCodeBlock}
        isActive={toolbarState.blockType === "code"}
      >
        Code Block
      </DropDownItem>
    </DropDown>
  );
}
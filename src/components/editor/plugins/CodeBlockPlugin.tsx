import React, { useEffect, useState } from "react";
import {Button} from '@/components/ui/button'
import  DropDown,{ DropDownItem} from '../ui/dropdown.tsx'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  registerCodeHighlighting,
  $createCodeNode,
  getCodeLanguages,
  $isCodeNode,
} from "@lexical/code";
import {Code} from 'lucide-react'
import { useToolbarState } from "../context/ToolbarContext.tsx"
import { $getNodeByKey, $getSelection, $isRangeSelection } from "lexical";
import { $wrapNodes } from "@lexical/selection";

const lanugages = getCodeLanguages();

interface CodeBlockPluginProps {
  codeLanguage: string;
  blockType: string;
  selectedElementKey: string;
}

export default function CodeBlockPlugin({
  codeLanguage,
  blockType,
  selectedElementKey,
}: CodeBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  const {toolbarState, updateToolbarState} = useToolbarState();

  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
        updateToolbarState('selectedLanguage', 'javascript')
      }
    });
  };

  const onLanguageChange = (language: string) => {
    editor.update(() => {
      if (!selectedElementKey) return;
      const node = $getNodeByKey(selectedElementKey);
      if ($isCodeNode(node)) {
        node.setLanguage(language);
        updateToolbarState('selectedLanguage', language)
      }
    });
  };
  

  return (
      blockType === "code" && (
        <DropDown buttonLabel={toolbarState.selectedLanguage} size="sm" value={codeLanguage}>
          {lanugages.map((language) => (
            <DropDownItem key={language} onClick={()=> onLanguageChange(language)} value={language}>{language}</DropDownItem>
          ))}
        </DropDown>
      )
  );
}
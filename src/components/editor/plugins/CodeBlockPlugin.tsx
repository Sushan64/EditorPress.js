import { Flex, IconButton, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {Button} from '@/components/ui/button'
import  DropDown,{ DropDownItem} from '../ui/dropdown.tsx'
import { CodeSquare } from "react-bootstrap-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  registerCodeHighlighting,
  $createCodeNode,
  getCodeLanguages,
  $isCodeNode,
} from "@lexical/code";
import {Code} from 'lucide-react'
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
  const [selectedLanguage, setSelectedLanguage] = useState('javasript')
  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
        setSelectedLanguage('javascript')
      }
    });
  };

  const onLanguageChange = (language: string) => {
    editor.update(() => {
      if (!selectedElementKey) return;
      const node = $getNodeByKey(selectedElementKey);
      if ($isCodeNode(node)) {
        node.setLanguage(language);
        setSelectedLanguage(language)
      }
    });
  };

  return (
    <div className="flex align-center gap-1">
      <Button
        aria-label="Add Code Block"
        size="sm"
        variant="ghost"
        onClick={onAddCodeBlock}
        ><Code/></Button>
      {blockType === "code" && (
        <DropDown buttonLabel={selectedLanguage} size="sm" value={codeLanguage}>
          {lanugages.map((language) => (
            <DropDownItem key={language} onClick={()=> onLanguageChange(language)} value={language}>{language}</DropDownItem>
          ))}
        </DropDown>
      )}
    </div>
  );
}
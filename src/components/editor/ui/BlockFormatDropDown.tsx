// BlockFormatDropDown.tsx
import {useCallback} from "react";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";

import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";

import DropDown, { DropDownItem } from "./dropdown.tsx";
import { ChevronDown } from "lucide-react";

export function BlockFormatDropDown({ editor, blockType }) {

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
      }
    });
  }, [editor]);

  // Label on top of the button
  const currentLabel = {
    paragraph: "Paragraph",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    quote: "Quote",
    code: "Code Block",
  }[blockType] ?? "Format";

  return (
    <DropDown
      buttonLabel={currentLabel}
      buttonIconClassName={<ChevronDown className="w-4 h-4" />}
      buttonAriaLabel="Block Format"
    >
      <DropDownItem
        onClick={formatParagraph}
        isActive={blockType === "paragraph"}
      >
        Paragraph
      </DropDownItem>

      <DropDownItem
        onClick={() => formatHeading("h1")}
        isActive={blockType === "h1"}
      >
        Heading 1
      </DropDownItem>

      <DropDownItem
        onClick={() => formatHeading("h2")}
        isActive={blockType === "h2"}
      >
        Heading 2
      </DropDownItem>

      <DropDownItem
        onClick={() => formatHeading("h3")}
        isActive={blockType === "h3"}
      >
        Heading 3
      </DropDownItem>

      <DropDownItem
        onClick={formatQuote}
        isActive={blockType === "quote"}
      >
        Quote
      </DropDownItem>

      <DropDownItem
        onClick={formatCodeBlock}
        isActive={blockType === "code"}
      >
        Code Block
      </DropDownItem>
    </DropDown>
  );
}
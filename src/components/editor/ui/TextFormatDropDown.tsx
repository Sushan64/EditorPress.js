// TextFormatDropDown.tsx
import {
  FORMAT_ELEMENT_COMMAND,
} from "lexical";

import {
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
} from 'lucide-react'

import DropDown, { DropDownItem } from "./dropdown.tsx";
import { ChevronDown } from "lucide-react";

export function TextFormatDropDown({ editor, textFormat }) {


  // Label on top of the button
  const currentLabel = {
    left: <TextAlignStart />,
    center: <TextAlignCenter />,
    right: <TextAlignEnd />,
    justify: <TextAlignJustify />,
  }[textFormat] ?? "Format";

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
        isActive={textFormat === "left"}
      >
        Left Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        isActive={textFormat === "center"}
      >
        Center Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        isActive={textFormat === "right"}
      >
        Right Align
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        isActive={textFormat === "justify"}
      >
        Justify
      </DropDownItem>
    </DropDown>
  );
}
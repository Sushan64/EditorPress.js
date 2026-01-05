import type { JSX } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState, Dispatch } from 'react';

import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
} from 'lexical';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  $isLinkNode,
  $isAutoLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';

import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { getSelectedNode } from '../../utils/getSelectedNode.ts';
import { sanitizeUrl } from '../../utils/url.ts';
import { setFloatingElemPositionForLinkEditor } from '../../utils/setFloatingElemPositionForLinkEditor.ts';

function FloatingLinkEditor({
  editor,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');

  const update = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      setIsLink(false);
      return;
    }

    const node = getSelectedNode(selection);
    const linkNode =
      $findMatchingParent(node, $isLinkNode) ??
      $findMatchingParent(node, $isAutoLinkNode);

    if (!linkNode) {
      setIsLink(false);
      return;
    }

    setIsLink(true);
    setLinkUrl(linkNode.getURL());

    const nativeSelection = window.getSelection();
    if (!nativeSelection || !editorRef.current) return;

    const domRect =
      nativeSelection.focusNode?.parentElement?.getBoundingClientRect();

    if (domRect) {
      domRect.y += 40;
      setFloatingElemPositionForLinkEditor(
        domRect,
        editorRef.current,
        anchorElem,
      );
    }
  }, [anchorElem]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(update);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          update();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          setIsLinkEditMode(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, update]);

  useEffect(() => {
    if (isLinkEditMode) {
      setEditedLinkUrl(linkUrl || 'https://');
      inputRef.current?.focus();
    }
  }, [isLinkEditMode, linkUrl]);

  if (!isLink && !isLinkEditMode) {
    return <></>;
  }

  return createPortal(
  <div
    ref={editorRef}
    className="absolute z-50 flex flex-wrap items-center gap-2 max-w-[calc(100vw-2rem)] rounded-xl border bg-background p-2 shadow-md"
    onMouseDown={(e) => {
      // PREVENT Lexical from stealing focus
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {isLinkEditMode ? (
      <>
        <Input
          ref={inputRef}
          value={editedLinkUrl}
          placeholder="Enter URL"
          className="h-9 min-w-0 flex-1 sm:w-[260px]"
          onChange={(e) => setEditedLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                sanitizeUrl(editedLinkUrl)
              );
              setIsLinkEditMode(false);
            }
            if (e.key === "Escape") {
              setIsLinkEditMode(false);
            }
          }}
        />

        <Button
          size="sm"
          className="shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            editor.dispatchCommand(
              TOGGLE_LINK_COMMAND,
              sanitizeUrl(editedLinkUrl)
            );
            setIsLinkEditMode(false);
          }}
        >
          Save
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsLinkEditMode(false)}
        >
          Cancel
        </Button>
      </>
    ) : (
      <Button
        size="sm"
        variant="ghost"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsLinkEditMode(true)}
      >
        Edit link
      </Button>
    )}
  </div>,
  anchorElem
);
}

export default function FloatingLinkEditorPlugin({
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <FloatingLinkEditor
      editor={editor}
      anchorElem={anchorElem}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />
  );
}
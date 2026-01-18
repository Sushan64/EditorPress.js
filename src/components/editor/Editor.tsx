import {$getRoot, $getSelection} from 'lexical';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button'
import {theme} from "./theme/index.ts"
import { Toolbar } from  "./ui/toolbar.tsx"
import {validateUrl} from './utils/url.ts';

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { $generateHtmlFromNodes } from '@lexical/html';

import {
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin/index.tsx"
import {ListPlugin} from '@lexical/react/LexicalListPlugin'
// Nodes
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ListItemNode, ListNode} from '@lexical/list';
import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ImageNode} from './nodes/ImageNode.tsx'
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}



const defaultContent = localStorage.getItem('content') || ""
export default function Editor() {
  
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const initialConfig = {
    namespace: 'MyEditor',
    theme: theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      ImageNode,
  ],
    editorState: defaultContent || undefined,
  };

  return (
    <div className="relative w-full max-w-2xl bg-white p-6 space-y-4">
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar setIsLinkEditMode={setIsLinkEditMode} />
      <RichTextPlugin
        contentEditable={
                <div className="relative" ref={onRef}>
                  <ContentEditable
                    aria-placeholder={'Enter some text...'}
                    className="outline-none"
                  />
                </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <TablePlugin />
      <ListPlugin />
      <LinkPlugin
      validateUrl={validateUrl}
      attributes={
          {
              rel: 'noopener noreferrer',
              target: '_blank',
            }
      } />
    {floatingAnchorElem && (
      <FloatingLinkEditorPlugin
      anchorElem={floatingAnchorElem}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode} />
    )}
    </LexicalComposer>
   
    </div>
  );
}
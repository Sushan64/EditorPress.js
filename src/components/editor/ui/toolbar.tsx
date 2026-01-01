import {useState, useCallback, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group"
import {Toggle} from "@/components/ui/toggle"
import { useToolbarState } from "../context/ToolbarContext.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Subscript,
  ChevronDown,
  Superscript,
} from 'lucide-react'

// Lexcial
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical'

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const {toolbarState, updateToolbarState} = useToolbarState();
  const [activeEditor, setActiveEditor] = useState(editor);
 
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough'),
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isHighlight', selection.hasFormat('highlight'));
      }}, [
    activeEditor,
    editor,
  ]);
 
  useEffect(() => {
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor: activeEditor},
        );
      })
  }, [$updateToolbar, editor,]);


  return (
    <div className="space-x-3">
      <ButtonGroup>
      {/* Bold Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isBold ? "bg-muted": ""}
      ><Bold /></Button>
      
      {/* Italic Button */}
      <Button
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      size="sm"
      className={toolbarState.isItalic ? "bg-muted": ""}
      variant="outline"
      
      ><Italic /></Button>
      
      {/* Underline Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isUnderline ? "bg-muted": ""}
      ><Underline />
      </Button>
          
      {/* Code Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isCode ? "bg-muted": ""}
      ><Code />
      </Button>
      
      {/* Strikethrough Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isStrikethrough ? "bg-muted": ""}
      ><Strikethrough />
      </Button>
      
      {/* Superscript Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isSuperscript ? "bg-muted": ""}
      ><Superscript />
      </Button>
      
      {/* Subscript Button */}
      <Button 
      onClick={()=> {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isSubscript ? "bg-muted": ""}
      ><Subscript />
      </Button>
      </ButtonGroup>
    </div>
  )
}
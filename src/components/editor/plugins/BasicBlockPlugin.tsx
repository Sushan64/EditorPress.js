import {useEffect, useState, useCallback} from 'react'
import {Button} from "@/components/ui/button"
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group"
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Subscript,
  Superscript,
} from 'lucide-react'
import {
    FORMAT_TEXT_COMMAND,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';


export default function BasicBlockPlugin(){
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);

  const $updateToolbar = useCallback(()=>{
    const selection = $getSelection()
    if ($isRangeSelection(selection)){
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsSubscript(selection.hasFormat('subscript'))
      setIsSuperscript(selection.hasFormat('superscript'))
      setIsCode(selection.hasFormat('code'))
    }
  })
  
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
  
  return(<>
     <ButtonGroup>
      {/* Bold Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      size="sm"
      variant="outline"
      className={isBold ? "bg-muted": ""}
      ><Bold /></Button>
      
      {/* Italic Button */}
      <Button
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      size="sm"
      className={isItalic ? "bg-muted": ""}
      variant="outline"
      
      ><Italic /></Button>
      
      {/* Underline Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      size="sm"
      variant="outline"
      className={isUnderline ? "bg-muted": ""}
      ><Underline />
      </Button>
          
      {/* Code Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      size="sm"
      variant="outline"
      className={isCode ? "bg-muted": ""}
      ><Code />
      </Button>
      
      {/* Strikethrough Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }}
      size="sm"
      variant="outline"
      className={isStrikethrough ? "bg-muted": ""}
      ><Strikethrough />
      </Button>
      
      {/* Superscript Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      }}
      size="sm"
      variant="outline"
      className={isSuperscript ? "bg-muted": ""}
      ><Superscript />
      </Button>
      
      {/* Subscript Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      }}
      size="sm"
      variant="outline"
      className={isSubscript ? "bg-muted": ""}
      ><Subscript />
      </Button>
      </ButtonGroup>
  </>)
}
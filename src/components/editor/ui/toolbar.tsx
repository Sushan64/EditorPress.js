import {useState, useCallback, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group"
import {Toggle} from "@/components/ui/toggle"
import { useToolbarState } from "../context/ToolbarContext.tsx"
import DropDown, {
  DropDownItem,
} from "./dropdown.tsx"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {BlockFormatDropDown} from './BlockFormatDropDown.tsx'
import {TextFormatDropDown} from './TextFormatDropDown.tsx'
import {Input} from "@/components/ui/input"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Bold,
  Italic,
  Underline,
  Code,
  Strikethrough,
  Subscript,
  ChevronDown,
  Superscript,
  Undo,
  Redo,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Table,
  Trash2,
} from 'lucide-react'

// Lexcial
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical'

import{
  INSERT_TABLE_COMMAND,
  $isTableNode,
}from '@lexical/table'

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const {toolbarState, updateToolbarState} = useToolbarState();
  
  const tableSchema = z.object({
    row: z.coerce.number().min(1, {message:'Rows cannot be less then 1'}).max(100, {message: "Rows must be less then 100"}).positive(),
    column: z.coerce.number().min(1, {message:'Columns cannot be less then 1'}).max(100, {message: "Colunm must be less then 100"}).positive(),
  })
  
  const tableForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues:{
      row: 5,
      column: 5,
    },
  })
  
  const insertTable = (value)=>{
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: value.column,
      rows: value.row,
    });
    console.log(value)
    setOpenTableDialog(false)
    tableForm.reset()
  }
  
  
  const [tableRow, setTableRow] = useState(1);
  const [tableColumn, setTableColumn] = useState(1);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isLeftAlign, setIsLeftAlign] = useState(false);
  const [isRightAlign, setIsRightAlign] = useState(false);
  const [isCenterAlign, setIsCenterAlign] = useState(false);
  const [isJustifyAlign, setIsJustifyAlign] = useState(false);
  
  const deleteTable = (editor) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      let node = selection.anchor.getNode();
      while (node && !$isTableNode(node)) {
        node = node.getParent();
      }
      if ($isTableNode(node)) {
        node.remove();
      }
    });
  };
  
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
      updateToolbarState('isCode', selection.hasFormat('code'));
      
      
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const elementType = element.getType();
      const elementFormat = element.getFormatType();
      const elementTag = element.getTag ? element.getTag() : null;
      
      let blockType;
      switch (elementType){
        case "heading":
          blockType = elementTag; 
          break
        case "quote":
          blockType ="quote";
          break
        case "list":
          blockType = element.getListType();
          break
        case "code":
          blockType = "code";
          break
        default:
          blockType = "paragraph"
      }
      updateToolbarState("blockType", blockType);
    
      let textFormat;
      switch (elementFormat){
        case 'right':
          textFormat = "right";
          break
        case "center":
          textFormat = "center";
          break
        case "justify":
          textFormat = "justify";
          break
        default:
          textFormat = "left";
      }
      updateToolbarState("textFormat", textFormat);
      
      let node = selection.anchor.getNode();
      while (node && !$isTableNode(node)) {
        node = node.getParent();
      }
      updateToolbarState('isInTable', $isTableNode(node));
      }}, []);
 
  useEffect(() => {
    return mergeRegister(
    editor.registerUpdateListener(({editorState}) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor},
        );
      }),

    editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      
    
    editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
  );
}, [editor, $updateToolbar]);


  return (
    <div className="overflow-x-scroll">
      <div className="space-x-3 flex">
        <ButtonGroup>
        <Button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        variant="outline"
        size="sm"
        aria-label="Undo">
        <Undo />
      </Button>
      <Button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        variant="outline"
        size="sm"
        aria-label="Redo">
        <Redo />
      </Button>
        </ButtonGroup>
        <BlockFormatDropDown
        blockType={toolbarState.blockType}
        rootType={toolbarState.rootType}
        editor={editor}
        />
        
      <ButtonGroup>
      {/* Bold Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isBold ? "bg-muted": ""}
      ><Bold /></Button>
      
      {/* Italic Button */}
      <Button
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      size="sm"
      className={toolbarState.isItalic ? "bg-muted": ""}
      variant="outline"
      
      ><Italic /></Button>
      
      {/* Underline Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isUnderline ? "bg-muted": ""}
      ><Underline />
      </Button>
          
      {/* Code Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isCode ? "bg-muted": ""}
      ><Code />
      </Button>
      
      {/* Strikethrough Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isStrikethrough ? "bg-muted": ""}
      ><Strikethrough />
      </Button>
      
      {/* Superscript Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isSuperscript ? "bg-muted": ""}
      ><Superscript />
      </Button>
      
      {/* Subscript Button */}
      <Button 
      onClick={()=> {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      }}
      size="sm"
      variant="outline"
      className={toolbarState.isSubscript ? "bg-muted": ""}
      ><Subscript />
      </Button>
      </ButtonGroup>
      
      <TextFormatDropDown
        textFormat={toolbarState.textFormat}
        editor={editor}
      />
      
      <ButtonGroup>
      <Dialog open={openTableDialog} onOpenChange={()=>{
        tableForm.reset()
        setOpenTableDialog(!openTableDialog)
      }}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Table />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Table</DialogTitle>
          </DialogHeader>
          <Form {...tableForm}>
            <form onSubmit={tableForm.handleSubmit(insertTable)} className="space-y-4">
              <FormField
              control={tableForm.control}
              name="row"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Rows</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              
              <FormField
                control={tableForm.control}
                name="column"
                render={({ field })=>(
                  <FormItem>
                    <FormLabel>Columns</FormLabel>
                    <FormControl>
                      <Input type="number" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={()=> tableForm.reset()}>Cancel</Button>
              </DialogClose>
                <Button type="submit">Insert</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Button
      size="sm"
      variant="destructive"
      disabled={!toolbarState.isInTable}
      onClick={()=>deleteTable(editor)}
      >
        <Trash2 />
      </Button>
      </ButtonGroup>
      </div>
    </div>
  )
}
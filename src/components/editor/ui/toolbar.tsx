import {useState, useCallback, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group"
import {Toggle} from "@/components/ui/toggle"
import { useToolbarState } from "../context/ToolbarContext.tsx"
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";
import DropDown, {
  DropDownItem,
} from "./dropdown.tsx"
import {z} from "zod"
import {toast} from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {BlockFormatDropDown} from './BlockFormatDropDown.tsx'
import {TextFormatDropDown} from './TextFormatDropDown.tsx'
import {Input} from "@/components/ui/input"
import ImagePlugin from "../plugins/ImagePlugin.tsx";
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
  Table,
  Trash2,
  Link2,
  Link2Off,
  Save,
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
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {getSelectedNode} from '../utils/getSelectedNode.ts'
import {sanitizeUrl} from '../utils/url.ts';
import CodeBlockPlugin from '../plugins/CodeBlockPlugin.tsx'
import BasicBlockPlugin from '../plugins/BasicBlockPlugin.tsx'
import TextAlignmentPlugin from '../plugins/TextAlignmentPlugin.tsx'
import BlockTypePlugin from '../plugins/BlockTypePlugin.tsx'
import ListPlugin from '../plugins/ListPlugin.tsx'


export function Toolbar({isLinkEditMode, setIsLinkEditMode }) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const {toolbarState, updateToolbarState} = useToolbarState();
  
  const saveContent = ()=> {
    const editorState = editor.getEditorState();
    const json = JSON.stringify(editorState.toJSON());
    localStorage.setItem('content', json);
    toast.success('Saved!')
  }
  
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
  
  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          activeEditor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl('https://'),
          );
        }
      });
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, editor, setIsLinkEditMode, toolbarState.isLink]);
  
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      updateToolbarState('isHighlight', selection.hasFormat('highlight'));

      let node = selection.anchor.getNode();
      while (node && !$isTableNode(node)) {
        node = node.getParent();
      }
      updateToolbarState('isInTable', $isTableNode(node));
      
      const linkNode = getSelectedNode(selection);
      const parent = linkNode.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(linkNode);
      updateToolbarState('isLink', isLink);
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
    <div className="overflow-x-scroll flex items-center">
      <div className="flex">
        <div className="space-x-3 flex mr-10">
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
        
        <BlockTypePlugin />
        <CodeBlockPlugin 
          codeLanguage={toolbarState.codeLanguage}
          blockType={toolbarState.blockType}
          selectedElementKey={toolbarState.selectedElementKey}
        />
        <BasicBlockPlugin />
        <TextAlignmentPlugin />
        <ListPlugin />
        
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
      
      <Button
      variant="outline"
      size="sm"
      onClick={insertLink}
      >
        {!toolbarState.isLink ? (
        <Link2 />
        ) :(
        <Link2Off />
        )}
      </Button>
      
      <ImagePlugin />
      
      </div>
      <div className="absolute right-0 bg-background px-2">
        <Button variant="outline" onClick={saveContent} size="sm">
        <Save size={20} />
      </Button>
      </div>
      </div>
    </div>
  )
}
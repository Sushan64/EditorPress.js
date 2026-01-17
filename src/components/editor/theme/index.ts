import './editor.css'

export const theme = {
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  table: 'block max-w-full overflow-x-auto border-collapse border border-muted my-4 overscroll-x-contain',
  tableRow: 'border border-muted',
  tableCell: 'border border-muted p-2 min-w-[120px] align-top',
  tableCellHeader: 'border border-muted bg-muted/60 font-semibold p-2',
  heading: {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-md font-semibold tracking-tight',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'list-decimal',
    ul: 'list-disc',
    listitem: 'editor-listItem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked',
  },
  hashtag: 'editor-hashtag',
  image: 'editor-image',
  link: 'underline',
  text: {
    bold: 'bold',
    code: 'editor-textCode',
    italic: 'italic',
    strikethrough: 'line-through',
    subscript: 'editor-textSubscript',
    superscript: 'editor-textSuperscript',
    underline: 'underline',
    underlineStrikethrough: 'editor-textUnderlineStrikethrough',
  },
  code: "editorCode",
  codeHighlight: {
    atrule: "editorTokenAttr",
    attr: "editorTokenAttr",
    boolean: "editorTokenProperty",
    builtin: "editorTokenSelector",
    cdata: "editorTokenComment",
    char: "editorTokenSelector",
    class: "editorTokenFunction", // class constructor
    comment: "editorTokenComment", // comment
    constant: "editorTokenProperty",
    deleted: "editorTokenProperty",
    doctype: "editorTokenComment",
    entity: "editorTokenOperator",
    function: "editorTokenFunction", // es5 function
    important: "editorTokenVariable",
    inserted: "editorTokenSelector",
    keyword: "editorTokenAttr", // variable keyword like const/let
    namespace: "editorTokenVariable",
    number: "editorTokenProperty", // number values
    operator: "editorTokenOperator", // operator like +/*-
    prolog: "editorTokenComment",
    property: "editorTokenProperty",
    punctuation: "editorTokenPunctuation", // brackets of array, object
    regex: "editorTokenVariable",
    selector: "editorTokenSelector",
    string: "editorTokenSelector", // string values
    symbol: "editorTokenProperty",
    tag: "editorTokenProperty",
    url: "editorTokenOperator",
    variable: "editorTokenVariable",
  },
};
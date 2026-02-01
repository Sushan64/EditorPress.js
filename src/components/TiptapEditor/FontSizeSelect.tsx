import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useEditorState } from "@tiptap/react";

export default function FontSizeSelect({ editor, size="sm" }) {
    const fontSize = [
        "11px",
        "12px",
        "13px",
        "14px",
        "15px",
        "16px",
        "17px",
        "18px",
        "19px",
        "20px"
    ];
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            const state = {};
            fontSize.forEach(size => {
                state[size] = editor.isActive("textStyle", {
                    fontSize: size
                });
            });
            return state;
        }
    });
    
    const currentValue = () => {
        for (let size of fontSize) {
            if (editorState[size]) return size
        };
        return "16px"
    };
    
    const handleChange = (value)=>{
      editor.chain().focus().setFontSize(value).run()
    }
    return (
        <>
            <Select value={currentValue()} onValueChange={handleChange}>
                <SelectTrigger size={size}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {fontSize.map(size => (
                        <SelectItem key={size} value={size}>
                         {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}

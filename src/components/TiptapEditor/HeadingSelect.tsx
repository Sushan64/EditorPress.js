import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { FileText, Hash, Quote } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function HeadingSelect({ editor }) {
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                isH1: editor.isActive("heading", { level: 1 }) ?? false,
                isH2: editor.isActive("heading", { level: 2 }) ?? false,
                isH3: editor.isActive("heading", { level: 3 }) ?? false,
                isH4: editor.isActive("heading", { level: 4 }) ?? false,
                isH5: editor.isActive("heading", { level: 5 }) ?? false,
                isH6: editor.isActive("heading", { level: 6 }) ?? false
            };
        }
    });
    const currentValue = () => {
        if (editorState.isH1) return "h1";
        if (editorState.isH2) return "h2";
        if (editorState.isH3) return "h3";
        if (editorState.isH4) return "h4";
        if (editorState.isH5) return "h5";
        if (editorState.isH6) return "h6";
        return "p";
    };
    const headingFormatOption = [
        { value: "p", label: "Normal", icon: <FileText /> },
        { value: "h1", label: "Heading 1", level: 1, icon: <Hash /> },
        { value: "h2", label: "Heading 2", level: 2, icon: <Hash /> },
        { value: "h3", label: "Heading 3", level: 3, icon: <Hash /> },
        { value: "h4", label: "Heading 4", level: 4, icon: <Hash /> },
        { value: "h5", label: "Heading 5", level: 5, icon: <Hash /> },
        { value: "h6", label: "Heading 6", level: 6, icon: <Hash /> }
    ];

    const handleChange = value => {
        if (value === "p") editor.commands.setParagraph();
        else if (value.startsWith("h")) {
        const level = parseInt(value.substring(1));
        editor.chain().toggleHeading({ level }).run();
        }
      };

    return (
        <Select value={currentValue()} onValueChange={handleChange}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {headingFormatOption.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

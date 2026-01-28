import { NodeViewContent,ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

function CodeBlockComponent({ node, updateAttributes, extension }) {
    const { language: defaultLanguage } = node.attrs;
    return (
        <NodeViewWrapper className="relative">
            <Select
                className="absolute bg-foreground right-2 top-2"
                contentEditable={false}
                defaultValue={defaultLanguage}
                onChange={event =>
                    updateAttributes({ language: event.target.value })
                }
            >
                <SelectContent>
                    <SelectItem value="null">auto</SelectItem>
                    <SelectItem disabled>—</SelectItem>
                    {extension.options.lowlight
                        .listLanguages()
                        .map((lang, index) => (
                            <SelectItem key={index} value={lang}>
                                {lang}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
            <pre>
                <NodeViewContent as="code" />
            </pre>
        </NodeViewWrapper>
    );
}

const _CodeBlockLowlight = CodeBlockLowlight.extend({
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockComponent);
    }
});
export default _CodeBlockLowlight;

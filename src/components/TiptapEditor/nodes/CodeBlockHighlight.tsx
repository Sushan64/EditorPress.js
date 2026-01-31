import React, { useMemo } from "react";
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer
} from "@tiptap/react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CodeBlock from "@tiptap/extension-code-block";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const CodeBlockNodeView = React.memo(
    function CodeBlockNodeView(props) {
        const { node, updateAttributes, extension } = props;

        const language = node.attrs.language || "javascript";
        const languages = useMemo(() => {
            return extension.options.lowlight?.listLanguages() || [];
        }, [extension.options.lowlight]);

        const handleLanguageChange = useMemo(
            () => e => updateAttributes({ language: e.target.value }),
            [updateAttributes]
        );

        return (
            <NodeViewWrapper className="relative group">
                <div className="absolute top-2 right-2 z-10">
                    <NativeSelect
                        className="text-white"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        {languages.map((lang, index) => (
                            <NativeSelectOption key={lang} value={lang}>
                                {lang}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </div>

                {/* actual code */}
                <pre className="bg-slate-900 rounded-lg p-4 pt-12 overflow-x-auto">
                    <NodeViewContent as="code" />
                </pre>
            </NodeViewWrapper>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.node.attrs.language === nextProps.node.attrs.language;
    }
);

const CodeBlockHighlight = CodeBlockLowlight.extend({
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockNodeView);
    },
});

export default CodeBlockHighlight;

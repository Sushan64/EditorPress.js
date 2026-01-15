import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import React,{ JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { useState } from 'react';
import { Resizable } from 're-resizable';
import { Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export type ImageAlignment = 'left' | 'center' | 'right';

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    alignment: ImageAlignment;
  },
  SerializedLexicalNode
>;

export type ImagePayload = {
  src: string;
  altText: string;
  maxWidth?: number;
  width?: "inherit" | number;
  height?: "inherit" | number;
  alignment?: ImageAlignment;
};

export const $createImageNode = (payload: ImagePayload, key?: NodeKey) => {
  return new ImageNode(payload, key);
};

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt, width, height } = domNode;
    const node = $createImageNode({ 
      src, 
      altText: alt,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    });
    return { node };
  }
  return null;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __height: "inherit" | number;
  __width: "inherit" | number;
  __maxWidth: number;
  __alignment: ImageAlignment;

  constructor(
    payload: ImagePayload = {
      src: '',
      altText: '',
      maxWidth: 400,
      alignment: 'center',
    },
    key?: NodeKey
  ) {
    super(key);
    this.__altText = payload.altText;
    this.__width = payload.width || 'inherit';
    this.__height = payload.height || 'inherit';
    this.__maxWidth = payload.maxWidth || 400;
    this.__src = payload.src;
    this.__alignment = payload.alignment || 'center';
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      {
        altText: node.__altText,
        src: node.__src,
        height: node.__height,
        width: node.__width,
        maxWidth: node.__maxWidth,
        alignment: node.__alignment,
      },
      node.__key
    );
  }

  setAlignment(alignment: ImageAlignment): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__maxWidth = width;
    writable.__height = height;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        maxWidth={this.__maxWidth}
        height={this.__height}
        alignment={this.__alignment}
        nodeKey={this.getKey()}
      />
    );
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = 'block my-5 clear-both';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement("img");
    image.setAttribute("src", this.__src);
    image.setAttribute("alt", this.__altText);
    if (this.__width !== 'inherit') {
      image.setAttribute("width", String(this.__width));
    }
    if (this.__height !== 'inherit') {
      image.setAttribute("height", String(this.__height));
    }
    return { element: image };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        return { conversion: convertImageElement, priority: 0 };
      },
    };
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.__altText,
      height: this.__height === 'inherit' ? undefined : this.__height,
      maxWidth: this.__maxWidth,
      src: this.__src,
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? undefined : this.__width,
      alignment: this.__alignment,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, maxWidth, src, width, alignment } = serializedNode;
    return new ImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      alignment,
    });
  }
}

// ImageComponent with re-resizable (like Blogger!)
function ImageComponent({ 
  src, 
  altText, 
  maxWidth, 
  height,
  alignment,
  nodeKey 
}: {
  src: string;
  altText: string;
  maxWidth: number;
  height: "inherit" | number;
  alignment: ImageAlignment;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();
  const [isHovered, setIsHovered] = useState(false);

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const onAlignmentChange = (e: React.MouseEvent, newAlignment: ImageAlignment) => {
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setAlignment(newAlignment);
      }
    });
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div 
      contentEditable={false}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block my-5 relative select-none"
    >
      <Resizable
        defaultSize={{
          width: maxWidth,
          height: height === 'inherit' ? 'auto' : height,
        }}
        className={`relative ${alignmentClasses[alignment]}`}
        minWidth={100}
        maxWidth="100%"
        lockAspectRatio={true}
        onResizeStop={(e, direction, ref, d) => {
          const newWidth = maxWidth + d.width;
          const newHeight = height === 'inherit' ? 'inherit' : (typeof height === 'number' ? height + d.height : height);
          
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
              node.setWidthAndHeight(newWidth, newHeight);
            }
          });
        }}
        handleStyles={{
          top: { cursor: 'n-resize' },
          right: { cursor: 'e-resize' },
          bottom: { cursor: 's-resize' },
          left: { cursor: 'w-resize' },
          topRight: { cursor: 'ne-resize' },
          bottomRight: { cursor: 'se-resize' },
          bottomLeft: { cursor: 'sw-resize' },
          topLeft: { cursor: 'nw-resize' },
        }}
        handleClasses={{
          top: 'hover:bg-blue-500',
          right: 'hover:bg-blue-500',
          bottom: 'hover:bg-blue-500',
          left: 'hover:bg-blue-500',
          topRight: 'hover:bg-blue-500',
          bottomRight: 'hover:bg-blue-500',
          bottomLeft: 'hover:bg-blue-500',
          topLeft: 'hover:bg-blue-500',
        }}
      >
        <img
          src={src}
          alt={altText}
          className="w-full h-full object-contain block rounded-lg shadow-md pointer-events-none"
          draggable={false}
        />

        {/* Toolbar */}
        {isHovered && (
          <div 
            className="absolute top-2 right-2 flex gap-1 bg-black/70 rounded-md p-1 z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onAlignmentChange(e, 'left');
              }}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                alignment === 'left' ? 'bg-blue-500/80' : 'hover:bg-white/10'
              }`}
              title="Align left"
            >
              <AlignLeft size={16} className="text-white" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onAlignmentChange(e, 'center');
              }}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                alignment === 'center' ? 'bg-blue-500/80' : 'hover:bg-white/10'
              }`}
              title="Align center"
            >
              <AlignCenter size={16} className="text-white" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onAlignmentChange(e, 'right');
              }}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                alignment === 'right' ? 'bg-blue-500/80' : 'hover:bg-white/10'
              }`}
              title="Align right"
            >
              <AlignRight size={16} className="text-white" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}
              className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        )}
      </Resizable>
    </div>
  );
}
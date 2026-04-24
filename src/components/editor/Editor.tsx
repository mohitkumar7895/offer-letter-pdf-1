"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Toolbar } from "./Toolbar";
import { uploadImage } from "./ImageHandler";
import { EditableBox } from "./extensions/EditableBox";
import { LayoutTemplate } from "lucide-react";
import "./editor.css";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function Editor({ content, onChange, placeholder = "Type your document content here...", readOnly = false }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);


  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      EditableBox,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "max-w-full rounded-md object-contain mx-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none max-w-none p-6 min-h-[400px]",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editor || readOnly) return;
      
      const { empty } = editor.state.selection;
      if (empty) {
        setMenuPos(null);
        return;
      }
      
      // Get the bounding box of the selection
      const { view } = editor;
      const { state } = view;
      const { from, to } = state.selection;
      
      try {
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        
        // Calculate center position above the selection
        setMenuPos({
          top: Math.min(start.top, end.top) - 40,
          left: start.left + (end.left - start.left) / 2,
        });
      } catch (e) {
        setMenuPos(null);
      }
    };

    const handleBlur = () => setMenuPos(null);

    editor?.on('selectionUpdate', handleSelectionChange);
    editor?.on('blur', handleBlur);
    
    return () => {
      editor?.off('selectionUpdate', handleSelectionChange);
      editor?.off('blur', handleBlur);
    };
  }, [editor, readOnly]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Failed to upload image", error);
      }
    },
    [editor]
  );

  const onImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 hover:shadow-md">
      {!readOnly && <Toolbar editor={editor} onImageClick={onImageClick} />}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-y-auto max-h-[600px] relative w-full">
        {menuPos && editor && (
          <div 
            style={{ 
              position: 'fixed', 
              top: `${menuPos.top}px`, 
              left: `${menuPos.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 50
            }}
            className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-1"
          >
            <button
              onClick={() => {
                editor.chain().focus().setEditableBox().run();
                setMenuPos(null);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Convert selection to an editable box"
              type="button"
            >
              <LayoutTemplate className="size-4 text-indigo-500" />
              Insert Box
            </button>
          </div>
        )}
        <EditorContent editor={editor} className="h-full w-full" />
      </div>
    </div>
  );
}

import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Image as ImageIcon,
  Highlighter,
  Type
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
  onImageClick: () => void;
}

export function Toolbar({ editor, onImageClick }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  
  const setAlign = (alignment: string) => editor.chain().focus().setTextAlign(alignment).run();
  
  const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();
  
  const setHighlight = () => editor.chain().focus().toggleHighlight().run();

  const handleInsertText = () => {
    const text = window.prompt("Enter text to insert:");
    if (text) {
      editor.chain().focus().insertContent(text).run();
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  const ToolbarBtn = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/95 p-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 rounded-t-xl">
      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={undo} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={redo} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={toggleH1} isActive={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleH2} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleH3} isActive={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={toggleBold} isActive={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleItalic} isActive={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleUnderline} isActive={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleStrike} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <div className="relative flex items-center h-full px-1" title="Text Color">
          <input
            type="color"
            onChange={handleColorChange}
            value={editor.getAttributes("textStyle").color || "#000000"}
            className="w-6 h-6 p-0 border-0 cursor-pointer bg-transparent"
          />
        </div>
        <ToolbarBtn onClick={setHighlight} isActive={editor.isActive("highlight")} title="Highlight">
          <Highlighter className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={() => setAlign("left")} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setAlign("center")} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setAlign("right")} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setAlign("justify")} isActive={editor.isActive({ textAlign: "justify" })} title="Justify">
          <AlignJustify className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={toggleBulletList} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleOrderedList} isActive={editor.isActive("orderedList")} title="Ordered List">
          <ListOrdered className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
        <ToolbarBtn onClick={toggleBlockquote} isActive={editor.isActive("blockquote")} title="Quote">
          <Quote className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={toggleCodeBlock} isActive={editor.isActive("codeBlock")} title="Code Block">
          <Code className="size-4" />
        </ToolbarBtn>
      </div>

      <div className="flex items-center gap-2 border-l pl-3 ml-1 border-slate-200 dark:border-slate-700">
        <button
          onClick={handleInsertText}
          title="Insert Text"
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800/50"
        >
          <Type className="size-3.5" />
          Insert Text
        </button>
        <button
          onClick={onImageClick}
          title="Insert Image"
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-300 rounded-lg transition-colors border border-teal-100 dark:border-teal-800/50"
        >
          <ImageIcon className="size-3.5" />
          Insert Image
        </button>
      </div>
    </div>
  );
}

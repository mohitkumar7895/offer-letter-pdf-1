import { Node, mergeAttributes } from "@tiptap/core";

export interface EditableBoxOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    editableBox: {
      /**
       * Wrap selected content in an editable box
       */
      setEditableBox: () => ReturnType;
      /**
       * Toggle an editable box
       */
      toggleEditableBox: () => ReturnType;
      /**
       * Unset an editable box
       */
      unsetEditableBox: () => ReturnType;
    };
  }
}

export const EditableBox = Node.create<EditableBoxOptions>({
  name: "editableBox",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  content: "block+",

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="editable-box"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "editable-box",
        class: "editable-content-box",
      }),
      0, // 0 represents the content insertion point
    ];
  },

  addCommands() {
    return {
      setEditableBox:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      toggleEditableBox:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
      unsetEditableBox:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});

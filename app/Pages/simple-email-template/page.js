"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { Mark } from "@tiptap/core";

const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: "16px",
        parseHTML: (element) => element.style.fontSize || "16px",
        renderHTML: (attributes) => {
          return attributes.size ? { style: `font-size: ${attributes.size}` } : {};
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark("fontSize", { size }).run();
        },
    };
  },
});

export default function RichTextEditor() {
  const router = useRouter();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontFamily.configure({ types: ["textStyle"] }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      FontSize,
    ],
  });

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem("savedContent", content);
      router.push("/saved-content");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Email Composer</h2>
      <div className="mb-2 d-flex gap-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Button>
        <Button onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Button>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary">Align</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</Dropdown.Item>
            <Dropdown.Item onClick={() => editor.chain().focus().setTextAlign("justify").run()}>Justify</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary">Font</Dropdown.Toggle>
          <Dropdown.Menu>
            {["Arial", "Helvetica", "Times New Roman", "Georgia", "Tahoma", "Verdana", "Courier New", "Trebuchet MS"].map((font) => (
              <Dropdown.Item key={font} onClick={() => editor.chain().focus().setFontFamily(font).run()}>
                {font}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary">Font Size</Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { label: "Small", size: "12px" },
              { label: "Normal", size: "16px" },
              { label: "Large", size: "24px" },
              { label: "Huge", size: "32px" },
            ].map((sizeOption) => (
              <Dropdown.Item key={sizeOption.size} onClick={() => editor.chain().focus().setFontSize(sizeOption.size).run()}>
                {sizeOption.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button onClick={() => editor.chain().focus().undo().run()}>Undo</Button>
        <Button onClick={() => editor.chain().focus().redo().run()}>Redo</Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Button>
        <Button onClick={() => editor.chain().focus().sinkListItem("listItem").run()}>➕ Indent More</Button>
        <Button onClick={() => editor.chain().focus().liftListItem("listItem").run()}>➖ Indent Less</Button>
        <Button onClick={() => editor.chain().focus().setLink({ href: prompt("Enter URL:") }).run()}>🔗 Link</Button>
      </div>
      {/* Font Color Picker */}
      <div>
        <label>🎨 Font Color:</label>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </div>
      {/* Highlight Color Picker */}
      <div>
        <label>🖍️ Highlight Color:</label>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
        />
        <Button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>Clear Formatting</Button>
      </div>
      <div className="editor-container p-3 border">
        <EditorContent editor={editor} />
      </div>
      <Button variant="primary" className="mt-3" onClick={handleSave}>Save</Button>
    </div>
  );
}

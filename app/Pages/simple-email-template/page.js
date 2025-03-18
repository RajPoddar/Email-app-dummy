'use client';

import { useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import Toolbar from './Toolbar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EmailComposer() {
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState('');

  // ✅ Corrected onChange function
  const onChange = (editorState, editor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      setEditorState(htmlString);
    });
  };

  return (
    <div className="container mt-4">
      <h3>Email Composer</h3>

      {/* ✅ Subject Field */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter subject..."
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <LexicalComposer initialConfig={{ theme: {}, onError: console.error }}>
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-content form-control" style={{ minHeight: '200px' }} />
          }
          placeholder={<div className="editor-placeholder">Write your email...</div>}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </LexicalComposer>

      {/* ✅ Save Button */}
      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          localStorage.setItem('savedSubject', subject);
          localStorage.setItem('savedEmail', editorState);
        }}
      >
        Save
      </button>
    </div>
  );
}

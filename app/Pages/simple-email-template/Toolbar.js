import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
import { useState, useEffect } from 'react';
import { $patchStyleText } from '@lexical/selection';
import { TOGGLE_STRIKETHROUGH_COMMAND } from '@lexical/rich-text';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({});
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    const updateActiveFormats = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setActiveFormats({
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            underline: selection.hasFormat('underline'),
            strikethrough: selection.hasFormat('strikethrough'),
          });

          // ✅ Instead of getStyle(), use patchStyleText to check active styles
          const node = selection.getNodes()[0];
          if (node && node.getStyle) {
            const styles = node.getStyle();
            setFontColor(styles.color || '#000000');
            setBgColor(styles['background-color'] || '#ffffff');
          }
        }
      });
    };

    return editor.registerUpdateListener(({ editorState }) => {
      updateActiveFormats();
    });
  }, [editor]);

  const applyFormat = (command, value) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(command, value);
        
        if (value === 'strikethrough') {
          selection.getNodes().forEach(node => {
            if (node.getStyle) {
              node.setStyle({ "text-decoration": "line-through" });
            }
          });
        }
      }
    });
  };
  
  

  const applyFontColor = (color) => {
    setFontColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color });
      }
    });
  };

  const applyBgColor = (color) => {
    setBgColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "background-color": color });
      }
    });
  };

  return (
    <div className="toolbar">
      <button className={activeFormats.bold ? 'active' : ''} onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'bold')}>
        <b>B</b>
      </button>

      <button className={activeFormats.italic ? 'active' : ''} onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'italic')}>
        <i>I</i>
      </button>

      <button className={activeFormats.underline ? 'active' : ''} onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'underline')}>
        <u>U</u>
      </button>

  <button className={activeFormats.strikethrough ? 'active' : ''} onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'strikethrough')}>
  S
</button>


      <select onChange={(e) => applyFormat(FORMAT_ELEMENT_COMMAND, e.target.value)}>
        <option value="left">Align Left</option>
        <option value="center">Align Center</option>
        <option value="right">Align Right</option>
      </select>

      <button onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'bullet')}>• List</button>
      <button onClick={() => applyFormat(FORMAT_TEXT_COMMAND, 'number')}>1. List</button>

      {/* ✅ Font Color Picker */}
      <input
        type="color"
        value={fontColor}
        onChange={(e) => applyFontColor(e.target.value)}
        title="Font Color"
      />

      {/* ✅ Background Color Picker */}
      <input
        type="color"
        value={bgColor}
        onChange={(e) => applyBgColor(e.target.value)}
        title="Background Color"
      />

      <button onClick={() => applyFormat(FORMAT_TEXT_COMMAND, null)}>✖ Clear</button>
    </div>
  );
}

import React, { useEffect, useRef, useCallback } from 'react'
import "./Canvas.css"

const Canvas = React.memo(({ defaultValue, typeSettings, setStorySettings }) => {
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleTab = useCallback((e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    // Insert tab at cursor position
    const newValue = value.substring(0, start) + "\t" + value.substring(end);
    textarea.value = newValue;
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    
    // Update parent state immediately
    setStorySettings(prev =>
      prev.rebuild({
        scene: {
          ...prev.scene,
          text: newValue
        }
      })
    );
  }, [setStorySettings]);

  const handleChange = useCallback((e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const value = e.target.value;
    
    timeoutRef.current = setTimeout(() => {
      setStorySettings(prev =>
        prev.rebuild({
          scene: {
            ...prev.scene,
            text: value
          }
        })
      );
      timeoutRef.current = null;
    }, 1000);
  }, [setStorySettings]);

  return (
    <textarea
      ref={textareaRef}
      className="story--canvas"
      placeholder="Type your story here"
      defaultValue={defaultValue}
      style={typeSettings}
      onKeyDown={handleTab}
      onChange={handleChange}
    />
  );
});

export default Canvas;

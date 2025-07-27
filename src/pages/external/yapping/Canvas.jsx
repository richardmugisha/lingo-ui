import React, { useEffect, useRef, useCallback } from 'react'
import "./Canvas.css"

const Canvas = React.memo(({ defaultValue, typeSettings, setStorySettings }) => {
  const timeoutRef = useRef(null);

  const handleTab = useCallback((e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    setStorySettings(prev =>
      prev.rebuild({
        scene: {
          ...prev.scene,
          text: prev.scene.text + "\t"
        }
      })
    );
  }, [setStorySettings]);

  const handleChange = useCallback((e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const value = e.target.value;

    timeoutRef.current = setTimeout(() => {
      console.log("fianlly")
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

  useEffect(() => {
    // Just logging mount for debug purposes
    console.log("Canvas mounted");
    return () => {
      // Clean up timer if unmounting
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <textarea
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

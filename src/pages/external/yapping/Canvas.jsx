

import React from 'react'
import "./Canvas.css"

const Canvas = ({ storySettings, setStorySettings}) => {

  const handleTab = e => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    setStorySettings(prev => prev.rebuild({scene: {...prev.scene, text: prev.scene.text + "\t"}}))
  }

  return (
    <textarea className="story--canvas"
        name="" id=""
        placeholder="Type your story here"
        value={storySettings.scene?.text}
        style={storySettings.typeSettings}
        onKeyDown={handleTab}
        onChange={e => setStorySettings(prev => prev.rebuild({scene: {...storySettings.scene, text: e.target.value}}))}
    ></textarea>
  )
}

export default Canvas
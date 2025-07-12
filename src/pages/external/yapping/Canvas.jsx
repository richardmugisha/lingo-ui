

import React from 'react'
import "./Canvas.css"

const Canvas = ({ storySettings, setStorySettings}) => {
  return (
    <textarea className="story--canvas"
        name="" id=""
        placeholder="Type your story here"
        value={storySettings.scene?.text}
        style={storySettings.typeSettings}
        onChange={e => setStorySettings(prev => prev.rebuild({scene: {...storySettings.scene, text: e.target.value}}))}
    ></textarea>
  )
}

export default Canvas
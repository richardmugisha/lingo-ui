
import Raw from "./Raw"
import Controls from "./Controls"
import { patchStory } from "../../../../../../api/http"
import { useState, useEffect } from "react"
import "./Outline.css"

const Outline = ({storySettings, setStorySettings}) => {
    const [ chapIdx, setChapIdx ] = useState(undefined)
    const [scIdx, setScIdx ] = useState(undefined)

    useEffect(() => {
        if (storySettings?.outline) {
            patchStory({id: storySettings._id, item: "outline", update: storySettings.outline})
            .then(console.log)
        }
    }, [storySettings?.outline])
  return (
    <article className="Outline">
        <Controls chapIdx={chapIdx} setChapIdx={setChapIdx} scIdx={scIdx} setScIdx={setScIdx} storySettings={storySettings} setStorySettings={setStorySettings}/>
        <Raw storySettings={storySettings} setStorySettings={setStorySettings} chapIdx={chapIdx} scIdx={scIdx}/>
    </article>
  )
                    
}

export default Outline
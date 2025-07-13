

import React from 'react'
import "./Toc.css"
import { fetchScene } from '../../../../../../api/http'

const Toc = ({ storySettings, setStorySettings, setChapterIndex, setSceneIndex, setTab }) => {

    const handleChapterNavigation = (chapIdx, sceneIdx) => {
        setChapterIndex(chapIdx)
        setSceneIndex(sceneIdx)
        const chap = storySettings.chapters[chapIdx]
        const scene = chap.scenes[sceneIdx]
        fetchScene(scene.id)
        .then(data => setStorySettings(prev => prev.rebuild({scene: data?.scene})))
        setTab("writing")
    }

  return (
    <article className="outline structured">
    {storySettings.chapters  ?
        <>
            <h1>Title: {storySettings.title || "Untitled Story"}</h1>
            {storySettings.chapters?.map((chapter, chIdx) => (
                <div key={chIdx} className="chapter" >
                    <h2>Ch{chIdx + 1}: {chapter?.title || "Untitled Chapter"}</h2>
                    <div className="scenes">
                    {
                        chapter?.scenes?.map((scene, idx) => <h3 onClick={() => handleChapterNavigation(chIdx, idx)}>Sc{idx + 1}: {scene.title || "Untitled Scene"}</h3>)
                    }
                    </div>
                </div>
            ))}
        </>
        : "Your Table of contents will show here"}
</article>
  )
}

export default Toc
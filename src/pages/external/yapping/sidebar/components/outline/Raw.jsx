

import React from 'react'

const Raw = ({storySettings, setStorySettings, chapIdx, scIdx}) => {

    const handleOutlineEdit = (newstorySettings) => {
    
        if (chapIdx === -1 && scIdx === -1) {
            return setStorySettings(prev => prev.rebuild({
                outline: { ...prev.outline, general: newstorySettings }
            }))
        }

        if (chapIdx === -2 && scIdx === -2) {
            return setStorySettings(prev => prev.rebuild({
                outline: { ...prev.outline, brainDump: newstorySettings }
            }))
        }
    
        if (chapIdx >= 0 && scIdx < 0) {
            return setStorySettings(prev => {
                const chaptersCopy = [...prev.outline.chapters]
                chaptersCopy[chapIdx] = {
                    ...chaptersCopy[chapIdx],
                    outline: newstorySettings,
                }
                return prev.rebuild({
                    outline: { ...prev.outline, chapters: chaptersCopy }
                })
            })
        }
    
        if (chapIdx >= 0 && scIdx >= 0) {
            return setStorySettings(prev => {
                const chaptersCopy = [...prev.outline.chapters]
                const scenesCopy = [...chaptersCopy[chapIdx].scenes]
                scenesCopy[scIdx] = newstorySettings
                chaptersCopy[chapIdx] = {
                    ...chaptersCopy[chapIdx],
                    scenes: scenesCopy,
                }
                return prev.rebuild({
                    outline: { ...prev.outline, chapters: chaptersCopy }
                })
            })
        }
    }
    

  return (
    <article className="outline raw-text">
        <textarea 
            style={{...storySettings.typeSettings}}
            value={
                chapIdx === -1 && scIdx === -1 ?
                storySettings?.outline?.general :
                chapIdx === -2 && scIdx === -2 ?
                storySettings?.outline?.brainDump :
                chapIdx >= 0 && scIdx < 0 ?
                storySettings?.outline?.chapters[chapIdx].outline :
                storySettings?.outline?.chapters[chapIdx]?.scenes[scIdx]
            }
            onChange={(e) => handleOutlineEdit(e.target.value)}
            placeholder={`The title of this outline goes here\n ------------------------------------------------------------------------\nAnd the summary goes here
            `}
        />
    </article>
  )
                    
}

export default Raw
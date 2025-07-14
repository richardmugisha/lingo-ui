
import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { Add, ArrowForward, ArrowRight, KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material"
import "./Controls.css"


const Controls = ({ setShowOutline, storySettings, setStorySettings, chapIdx, setChapIdx, scIdx, setScIdx }) => {
  const [ structure, setStructure ] = useState()
  const [showList, setShowList] = useState([])

  const handleAddNewChapter = () => {
      const chaptersCopy = storySettings.outline.chapters
      chaptersCopy.push({  outline: "", scenes: [] })
      setStorySettings(prev => prev.rebuild({outline: {...prev.outline, chapters: chaptersCopy}}))
      setChapIdx(chaptersCopy.length - 1)
      setScIdx(undefined)
  }

  const handleAddNewScene = (chIdx) => {
    const chaptersCopy = storySettings.outline.chapters
    chaptersCopy[chIdx].scenes.push("")
    setStorySettings(prev => prev.rebuild({outline: {...prev.outline, chapters: chaptersCopy}}))
    setChapIdx(chIdx)
    setScIdx(chaptersCopy[chIdx].scenes.length - 1)
  }

  useEffect(() => {
    if (storySettings?.outline) {
      setStructure(parseRawOutline(storySettings.outline))
    }
  }, [storySettings?.outline])

  const updateShowList = (chIdx) => {
    setChapIdx(chIdx); 
    setScIdx(-1); 
    const key = chIdx

    if (showList.includes(key)) {
      setShowList(showList.filter(item => item !== key))
    } else {
      setShowList([...showList, key])
    }
  }

  const viewBrainDump = () => {
    setChapIdx(-2); setScIdx(-2)
  }

  return (
    <article className='outline-controls'>
        <Button onClick={() => setShowOutline(prev => !prev)}>General Outline</Button>
        <h1 className={chapIdx < 0 && scIdx < 0 && "selected"} onClick={() => { setChapIdx(-1); setScIdx(-1)}}>Title: {structure?.general || "Untitled Story"}</h1>
        <section className='chapters'>
          {structure?.chapters?.map((ch, chIdx) => (
              <>
                <div onClick={() => updateShowList(chIdx) } className={chapIdx == chIdx && chIdx >=0 && scIdx < 0 ?"selected" : ""}>
                    <h3 onClick={() => updateShowList(chIdx) }>Ch{chIdx+1}: {ch?.outline || `Untitled`} </h3>
                    <KeyboardArrowDown />
                </div>
                { showList.includes(chIdx) &&
                  <section key={chIdx} className='scenes'>
                    {ch?.scenes?.map((sc, sceneIdx) => <h4 className={scIdx === sceneIdx && chapIdx === chIdx ? "selected" : ""} key={sceneIdx} onClick={() => { setChapIdx(chIdx); setScIdx(sceneIdx)}} >Sc{sceneIdx+1}: {sc || `Untitled`}</h4>)}
                    <Button color="info" startIcon={<Add /> } onClick={() => handleAddNewScene(chIdx)}>Scene</Button>
                  </section>
                }
              </>
            ))
          }
        <Button color="info" startIcon={<Add /> } onClick={handleAddNewChapter}>Chapter</Button>
        </section>
        <Button color="info" endIcon={<ArrowForward />} onClick={viewBrainDump}>Brain dump</Button>
    </article>
  )
}

export default Controls

const parseRawOutline = (raw) => {
  const general = parseIt(raw.general)[0]
  const chapters = raw.chapters.map(ch => {
    const chOut = parseIt(ch.outline)
    const scenes = ch.scenes.map(sc => parseIt(sc)[0])
    return {
      outline: chOut[0], scenes
    }
  })
  console.log(general, chapters)
  return {
    general, chapters
  }
}

const parseIt = (outline) => {
  return outline.split('\n').map(line => line.trim())
}

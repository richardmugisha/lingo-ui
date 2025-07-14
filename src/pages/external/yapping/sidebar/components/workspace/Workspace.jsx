

import React, { useState, useEffect } from 'react'
import { patchChapterLog, patchStory, createScene } from '../../../../../../api/http'
import { useTopicSearch } from '../../../../../../components/TopicSearch/useTopicSearch'
import TopicSearch from '../../../../../../components/TopicSearch/TopicSearch'
import WordCard from '../../../../../../components/word/Card'
import "./Workspace.css"
import { Button } from '@mui/material'
import { Add } from '@mui/icons-material'


const Workspace = ({ storySettings, setStorySettings, story, chapterIndex, setChapterIndex, sceneIndex, setSceneIndex}) => {

    const {
        topic,
        topics,
        suggestions,
        searchValue,
        setSearchValue,
        isLoading,
        addTopic,
        removeTopic
    } = useTopicSearch(storySettings.topics, "word-filling-mode")

    const [hoveredWord, setHoveredWord] = useState(null)
    const [selectedValue, setSelectedValue] = useState(null)

    const handleSceneTitleUpdate = (value) => {
        const chapterLog = storySettings.chapters
        chapterLog[chapterIndex].scenes[sceneIndex].title = value


        patchChapterLog({id: story._id, chapterLog})
        // .then(console.log)

        setStorySettings(prev => prev.rebuild({chapters: chapterLog}))
    }

    const handleChapterTitleUpdate = (value) => {
        const chapterLog = storySettings.chapters
        chapterLog[chapterIndex].title = value

        patchChapterLog({id: story._id, chapterLog})
        // .then(console.log)

        setStorySettings(prev => prev.rebuild({chapters: chapterLog}))

    }

    const handleTitleUpdate = (value) => {
        patchStory({id: story._id, item: "title", update: value})
        // .then(console.log)
        setStorySettings(prev => prev.rebuild({title: value}))
    }

    useEffect(() => {
        if (topic.words) {
            const allTopics = new Set([...storySettings.scene.topics, topic._id])
            const scene = {...storySettings.scene, topics: [...allTopics]}
            patchStory({id: story._id, item: "scene", update: scene})
            .then(console.log)
            setStorySettings(prev => prev.rebuild({suggestedWords: topic.words, scene: {...storySettings.scene, topics: [...allTopics]}}))
        }
    }, [topic])

    const handleOnHover = (wObj) => {
        setHoveredWord(prev => prev == wObj ? null : wObj)
    }
    const saveCurrentScene = async() => {
        try {
            return await patchStory({ id: story._id, item: "scene", update: storySettings.scene})
        } catch (error) {
            throw error
        }
    }

    const introduceNewScene = async () => {
        try {
            await saveCurrentScene()
            const data = await createScene()
            const chapterLog = storySettings.chapters
            chapterLog[chapterIndex].scenes.push({id: data.scene._id, title: "Untitled Scene"})
            await patchChapterLog({id: story._id, chapterLog})
            setStorySettings(prev => prev.rebuild({scene: data.scene, chapters: chapterLog}))

            setSceneIndex(sceneIndex + 1)
        } catch (error) {
            throw error
        }
    }

    const introduceNewChapter = async () => {
        try {
            await saveCurrentScene()
            const data = await createScene()
            const chapterLog = storySettings.chapters
            chapterLog.push({
                title: "Untitled Chapter",
                scenes: [ { id: data.scene._id, title: "Untitled Scene"}]
            })

            await patchChapterLog({id: story._id, chapterLog})

            setStorySettings(prev => prev.rebuild({scene: data.scene, chapters: chapterLog}))

            setChapterIndex(chapterIndex + 1)

        } catch (error) {
            throw error
        }
    }

  return (
    <article className="workspace">
        <p>Title: <input type="text" className="story-title metadata" value={storySettings.title} onChange={e => handleTitleUpdate(e.target.value)} /></p>
        <p>Ch {chapterIndex + 1}: <input type="text" className="chapter-title metadata" value={storySettings.chapters[chapterIndex]?.title} onChange={e => handleChapterTitleUpdate(e.target.value)}/></p>
        <p>Sc {sceneIndex + 1}: <input type="text" value={storySettings.chapters[chapterIndex]?.scenes[sceneIndex]?.title} onChange={e => handleSceneTitleUpdate(e.target.value)} className="scene-title metadata"/></p>
        <section className="sidebar--controls">
            <Button variant="outlined" color="info" startIcon={<Add /> } onClick={introduceNewChapter}>Chapter</Button>
            <Button variant="outlined" color="info" startIcon={<Add /> } onClick={introduceNewScene}>Scene</Button>
        </section>
        <TopicSearch
            topics={topics} mode="word-filling-mode"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            suggestions={suggestions}
            isLoading={isLoading}   
            addTopic={addTopic}
            removeTopic={removeTopic}
            selectedValue={selectedValue} setValue={setSelectedValue}
        />
        
        {selectedValue &&
            <ul className="side word-pool"> { storySettings.suggestedWords?.map((wObj, i) => 
                <span key={wObj._id} className={storySettings.words.includes(wObj.word) ? "right-word" : "wrong-word"} onClick={() => handleOnHover(wObj)}>
                    {wObj.word}{storySettings.words.filter(w => w === wObj.word).length > 1 ? <b>{`(${storySettings.words.filter(w => w === wObj.word).length}x)`}</b> : ""}
                </span>)} 
            </ul>
        }
        {hoveredWord && <div className="selected-word--card"><WordCard wObj={hoveredWord}/></div>}
        

    </article>
  )
}

export default Workspace
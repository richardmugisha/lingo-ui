import "./Sidebar.css"
import TopicSearch from "../../../../components/TopicSearch/TopicSearch"
import { useTopicSearch } from "../../../../components/TopicSearch/useTopicSearch"
import { createStory, patchStory, createChapter, patchChapter, fetchChapter, liveChat, patchEditDetails, patchDeleteDetails, patchTypeSettings, fetchStory, fetchScene, createScene, patchChapterLog } from "../../../../api/http"
import { useState, useEffect } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import { setChat, setInfo } from "../../../../features/system/systemSlice"
import WordCard from "../../../../components/word/Card"

let timerID;
let lastSaved;

// Function to parse the outline text into a structured object
const parseOutline = (text) => {
    // Split by any line containing 4 or more dashes
    const sections = text.split(/\n-{4,}\n/);
    const result = {
        title: '',
        logline: '',
        summary: '',
        chapters: []
    };

    // Parse the first section (book details)
    const bookDetails = sections[0].trim().split('\n').filter(line => line.trim());
    result.title = bookDetails[0]?.trim();
    result.logline = bookDetails[1]?.trim();
    result.summary = bookDetails[2]?.trim();

    // Parse chapters
    for (let i = 1; i < sections.length; i++) {
        const chapterLines = sections[i].trim().split('\n').filter(line => line.trim());
        if (chapterLines.length > 0) {  // Only add if there's content
            result.chapters.push({
                title: chapterLines[0]?.trim(),
                logline: chapterLines[1]?.trim(),
                summary: chapterLines[2]?.trim()
            });
        }
    }

    return result;
};

const Sidebar = ({ storySettings, setStorySettings }) => {
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

    const dispatch = useDispatch()
    const [selectedValue, setSelectedValue] = useState(null)
    const [showOutline, setShowOutline] = useState(false)
    const [showOutlineEditor, setShowOutlineEditor] = useState(true)
    const [showLoglines, setShowLoglines] = useState(true)
    const [outlineText, setOutlineText] = useState(storySettings.outline)
    const [parsedOutline, setParsedOutline] = useState(null)
    const [story, setStory] = useState(storySettings)
    const [chapter, setChapter] = useState(null)
    const [chapterIndex, setChapterIndex] = useState(0)
    const [sceneIndex, setSceneIndex] = useState(0)
    const [updateFlag, setUpdateFlag] = useState(true)
    const [hoveredWord, setHoveredWord] = useState(null)
    const [{ userId: userID, username }] = useState(JSON.parse(localStorage.getItem("user")))

    // Parse outline whenever the text changes
    useEffect(() => {
        if (!outlineText) return;
        const parsed = parseOutline(outlineText);
        setParsedOutline(parsed);

        const t = setTimeout(() => {
            patchStory({id: story._id, item: "outline", update: outlineText})
            // .then(data => console.log(data))
        }, 5000);

        return () => clearTimeout(t)
    }, [outlineText]);

    useEffect(() => {
        // console.log(story._id)
        if (story._id) {
            const chaptIdx = story.chapters.length - 1
            const lastChapter = story.chapters[chaptIdx]
            const sceneIdx = lastChapter.scenes.length - 1
            const lastScene = lastChapter.scenes[sceneIdx]

            setChapterIndex(chaptIdx)
            setSceneIndex(sceneIdx)
            fetchScene(lastScene.id)
            .then(data => setStorySettings(prev => prev.rebuild({scene: {...lastScene, ...data?.scene}})))
 
            setUpdateFlag(true)
        } else {
            createStory({})
            .then(data => {
                // console.log(data)
                setStory(data?.story || {});
                setStorySettings(prev => prev.rebuild(data?.story || {}))
            } )
        }
    }, [])

    useEffect(() => {
        if (topic.words) {
            const allTopics = new Set([...storySettings.scene.topics, topic._id])
            const scene = {...storySettings.scene, topics: [...allTopics]}
            patchStory({id: story._id, item: "scene", update: scene})
            .then(console.log)
            setStorySettings(prev => prev.rebuild({suggestedWords: topic.words, scene: {...storySettings.scene, topics: [...allTopics]}}))
        }
    }, [topic])

    useEffect(() => {
        if (storySettings?.scene?.text?.length && !updateFlag) {
            patchStory({ id: story._id, item: "scene", update: storySettings.scene})
                // .then(console.log)
        }
        setUpdateFlag(false)
        // lastSaved = storySettings.details.length
    }, [storySettings.scene?.text])

    // useEffect(() => {
    //     const sentencesCount = storySettings.scene?.text.length || 0
    //     if (sentencesCount > 0 && sentencesCount % 2 === 0) {
    //         const lastChunk = storySettings.scene.text.slice(-1000)
    //         const message = `
    //         You are talking to ${username}. I just stole their device for 2 seconds. I am their guardian angel. I noticed he is writing to improve their english fluency.
    //         help him with feedback on the coherence and transition of sentences. Your scrutinity should be more around english rules, and 20% about writing and creativity. Be brief.
    //         Talk to ${username} directly now. Here is the last chunk of his writing:
    //         ${lastChunk}`

    //         liveChat({userID, chat: message})
    //             .then(data => dispatch(setChat(data)))
    //             .catch(error => dispatch(setInfo({type: "warning", message: "Couldn't retrieve feedback for your writing!", timestamp: Date.now()})))
    //     }

    // }, [storySettings.scene?.text])

    useEffect(() => {
        if (storySettings?.words?.length && chapter) {
            const lastWord = storySettings.words[storySettings.words.length - 1]
            const lastWordID = topic.words?.find(wObj => wObj.word === lastWord)?._id
            patchChapter({ id: chapter._id, item: "words", update: {word: lastWordID, topic: topic._id} })
        }
    }, [storySettings.words])

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
            return adaptedData
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

    const handleChapterNavigation = (chapIdx, sceneIdx) => {
        setChapterIndex(chapIdx)
        setSceneIndex(sceneIdx)
        setShowOutline(false)
        const chap = storySettings.chapters[chapIdx]
        const scene = chap.scenes[sceneIdx]
        fetchScene(scene.id)
        .then(data => setStorySettings(prev => prev.rebuild({scene: data?.scene})))
        // fetchChapter({ index, storyID: story._id })
        setChapter(storySettings.chapters[chapIdx])
    }

    const handleOffHover = () => {
       
        timerID = setTimeout(() => {
            setHoveredWord(null);
        }, 500);
    }

    const handleOnHover = (wObj) => {
        clearTimeout(timerID)
        setHoveredWord(wObj);
    }

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
        if (parsedOutline?.title) handleTitleUpdate(parsedOutline.title)
    }, [parsedOutline?.title])

    useEffect(() => {
        switch (storySettings.operation) {
            case "delete": handleDeleteDetails(); break;
            case "edit": handleEditDetails(); break;
            case "save": handleSaveEditDetails(); break;
        }
    }, [storySettings.operation])

    useEffect(() => {
        if (storySettings.typeSettings && story._id) {
            patchTypeSettings({id: story._id, typeSettings: storySettings.typeSettings})
            // .then(console.log)
        }
    }, [storySettings.typeSettings])

    return (
        <article className="sidebar">
            <section>
                { showOutline &&
                    <article className="outline structured">
                        {storySettings.chapters  ? (
                            <>
                                <h1>{storySettings.title || parsedOutline?.title || "Untitled Story"}</h1>
                                {showLoglines && <p className="logline">{parsedOutline?.logline}</p>}
                                {/* <p className="summary">{parsedOutline.summary}</p> */}
                                
                                {storySettings.chapters?.map((chapter, index) => (
                                    <div key={index} className="chapter" >
                                        <h2>{chapter?.title || "Untitled Chapter"}</h2>
                                        {/* {showLoglines && <p className="logline">{chapter?.logline}</p>} */}
                                        <div className="scenes">
                                        {
                                            chapter?.scenes?.map((scene, idx) => <h3 onClick={() => handleChapterNavigation(index, idx)}>{scene.title || "Untitled Scene"}</h3>)
                                        }
                                        </div>
                                    </div>
                                ))}

                                
                                {/* <button 
                                    className="logline-toggle"
                                    onClick={() => setShowLoglines(!showLoglines)}
                                >
                                    {showLoglines ? 'Hide Loglines' : 'Show Loglines'}
                                </button> */}
                            </>
                            
                        ) : "Your outline will show here"}
                    </article>
                }
            
                {showOutline && showOutlineEditor &&
                    <article className="outline raw-text">
                        <textarea 
                            value={outlineText}
                            onChange={(e) => setOutlineText(e.target.value)}
                            placeholder="Enter your outline here..."
                        />
                    </article>
                }
                {
                    !(showOutline && showOutlineEditor) &&
                    <article className="workspace">
                        <input type="text" className="story-title metadata" value={storySettings.title} onChange={e => handleTitleUpdate(e.target.value)} />
                        <input type="text" className="chapter-title metadata" value={storySettings.chapters[chapterIndex]?.title} onChange={e => handleChapterTitleUpdate(e.target.value)}/>
                        <input type="text" value={storySettings.chapters[chapterIndex]?.scenes[sceneIndex]?.title} onChange={e => handleSceneTitleUpdate(e.target.value)} className="scene-title metadata"/>
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
                                <span key={wObj._id} className={storySettings.words.includes(wObj.word) ? "right-word" : "wrong-word"} onMouseEnter={() => handleOnHover(wObj)} onMouseLeave={handleOffHover}>
                                    {wObj.word}{storySettings.words.filter(w => w === wObj.word).length > 1 ? <b>{`(${storySettings.words.filter(w => w === wObj.word).length}x)`}</b> : ""}
                                </span>)} 
                            </ul>
                        }
                        {hoveredWord && <div className="selected-word--card"><WordCard wObj={hoveredWord}/></div>}
                    </article>
                }
            </section>
            <section className="sidebar--controls">
                <button onClick={introduceNewChapter}>New Chapter</button>
                <button onClick={introduceNewScene}>New scene</button>
                <button onClick={() => setShowOutline(!showOutline)}>
                    {showOutline ? <VisibilityOff /> : <Visibility /> }
                    Outline
                </button>
                <button onClick={() => setShowOutlineEditor(!showOutlineEditor)}>
                    {showOutlineEditor ? <VisibilityOff /> : <Visibility /> }
                    Outline Editor
                </button>
                <button onClick={() => setShowLoglines(!showLoglines)}>
                    {showLoglines ? <VisibilityOff /> : <Visibility /> }
                    Loglines
                </button>
                <select
                    value={storySettings.typeSettings?.fontFamily || "Roboto, sans-serif"}
                    onChange={e => setStorySettings(prev => prev.rebuild({ typeSettings: { ...prev.typeSettings, fontFamily: e.target.value } }))}
                >
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, Times, serif">Times New Roman</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                </select>
                <input type="number" min={8} max={48} step={1} value={storySettings.typeSettings?.fontSize || 16}
                    onChange={e => setStorySettings(prev => prev.rebuild({ typeSettings: { ...prev.typeSettings, fontSize: Number(e.target.value) } }) ) }
                    placeholder="Font size"
                    style={{ width: "4em", marginRight: "0.5em" }}
                />
                <input type="number" min={1} max={3} step={0.1} value={storySettings.typeSettings?.lineHeight || 1.5} onChange={e =>  setStorySettings(prev =>  prev.rebuild({ typeSettings: {  ...prev.typeSettings,  lineHeight: Number(e.target.value) }}))}
                    placeholder="Line height"
                    style={{ width: "4em" }}
                />
            </section>
        </article>
    )
}

export default Sidebar
import "./Sidebar.css"
import TopicSearch from "../../../../components/TopicSearch/TopicSearch"
import { useTopicSearch } from "../../../../components/TopicSearch/useTopicSearch"
import { createStory, patchStory, createChapter, patchChapter, fetchChapter, liveChat, patchEditDetails, patchDeleteDetails, patchTypeSettings, fetchStory, fetchScene, createScene, patchChapterLog } from "../../../../api/http"
import { useState, useEffect } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import { setChat, setInfo } from "../../../../features/system/systemSlice"
import WordCard from "../../../../components/word/Card"
import Header from "./components/header/Header"
import Outline from "./components/outline/Outline"
import Workspace from "./components/workspace/Workspace"
import Toc from "./components/toc/Toc"

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
    const [tab, setTab] = useState("outline") // outline | writing
    const [showOutlineEditor, setShowOutlineEditor] = useState(false)
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
    // useEffect(() => {
    //     if (!outlineText) return;
    //     const parsed = parseOutline(outlineText);
    //     setParsedOutline(parsed);

    //     const t = setTimeout(() => {
    //         patchStory({id: story._id, item: "outline", update: outlineText})
    //         // .then(data => console.log(data))
    //     }, 5000);

    //     return () => clearTimeout(t)
    // }, [outlineText]);

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
            setStorySettings(prev => prev.rebuild({ scene: {...storySettings.scene, topics: [...allTopics]}}))
        }
    }, [topic])

    useEffect(() => {
        if (storySettings?.scene?.text?.length && !updateFlag) {
            patchStory({ id: story._id, item: "scene", update: storySettings.scene})
                // .then(console.log)
        }
        setUpdateFlag(false)
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


    useEffect(() => {
        if (storySettings.typeSettings && story._id) {
            patchTypeSettings({id: story._id, typeSettings: storySettings.typeSettings})
            // .then(console.log)
        }
    }, [storySettings.typeSettings])


    return (
        <article className="sidebar">
            <Header tab={tab} setTab={setTab} />
            { tab === "outline" && <Outline storySettings={storySettings} setStorySettings={setStorySettings} /> }
            <section>
                { tab === "toc" && <Toc storySettings={storySettings} setStorySettings={setStorySettings} setChapterIndex={setChapterIndex} setSceneIndex={setSceneIndex} setChapter={setChapter} setTab={setTab}/>  }
            
                {showOutlineEditor &&
                    
                    <article className="outline raw-text">
                        <Outline value={storySettings.outline.general} setValue={setStorySettings}/>
                    </article>
                }
                { tab === "writing" && <Workspace setStorySettings={setStorySettings} story={story} storySettings={storySettings} chapterIndex={chapterIndex} setChapterIndex={setChapterIndex} sceneIndex={sceneIndex} setSceneIndex={setSceneIndex}/> }
            </section>
        </article>
    )
}

export default Sidebar
import "./Sidebar.css"
import TopicSearch from "../../../../components/TopicSearch/TopicSearch"
import { useTopicSearch } from "../../../../components/TopicSearch/useTopicSearch"
import { createStory, patchStory, createChapter, patchChapter, fetchChapter, liveChat } from "../../../../api/http"
import { useState, useEffect } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import { setChat, setInfo } from "../../../../features/system/systemSlice"

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
    const [updateFlag, setUpdateFlag] = useState(true)
    const [{ userId: userID, username }] = useState(JSON.parse(localStorage.getItem("user")))

    // Parse outline whenever the text changes
    useEffect(() => {
        if (!outlineText) return;
        const parsed = parseOutline(outlineText);
        setParsedOutline(parsed);

        const t = setTimeout(() => {
            patchStory({id: story._id, item: "outline", update: outlineText})
            .then(data => console.log(data))
        }, 5000);

        return () => clearTimeout(t)
    }, [outlineText]);

    useEffect(() => {
        console.log(story._id)
        if (story._id) {
            fetchChapter({ index: 0, storyID: story._id})
            .then( data => {
                setUpdateFlag(true)
                setChapter(data.chapter)
                setStorySettings(prev => prev.rebuild({ details: data.chapter.details}))
            })
        } else {
            createStory({})
            .then(data => {
                setStory(data?.story || {});
                createChapter({ storyID: data?.story?._id})
                .then(data => setChapter(data.chapter))
            } )
        }
    }, [])

    useEffect(() => {
        if (topic.words) setStorySettings(prev => prev.rebuild({suggestedWords: topic.words}))
    }, [topic])

    useEffect(() => {
        if (storySettings?.details?.length && chapter && !updateFlag) {
            console.log(storySettings.details)
            const lastDetail = storySettings.details[storySettings.details.length - 1]
            patchChapter({ id: chapter._id, item: "details", update: lastDetail})
        }
        setUpdateFlag(false)
    }, [storySettings.details])

    useEffect(() => {
        const sentencesCount = storySettings.details.length
        console.log(userID)
        if (sentencesCount > 0 && sentencesCount % 2 === 0) {
            const lastChunk = storySettings.details.slice(-5)
            const message = `
            You are talking to ${username}. I just stole their device for 2 seconds. I am their guardian angel. I noticed he is writing to improve their english fluency.
            ${storySettings.words.length ? `First make sure you scrutinize his use of these words in this writing. The words: ${storySettings.words.slice(-5)} | Then, ` : ""}
            help him with feedback on the coherence and transition of sentences. Your scrutinity should be more around english rules, and 20% about writing and creativity. Be brief.
            Talk to ${username} directly now. Here is the last chunk of his writing:
            ${lastChunk.map(sentenceObject => sentenceObject.sentence + ".")}`

            liveChat({userID, chat: message})
                .then(data => dispatch(setChat(data)))
                .catch(error => dispatch(setInfo({type: "warning", message: "Couldn't retrieve feedback for your writing!", timestamp: Date.now()})))
        }

    }, [storySettings.details])

    useEffect(() => {
        if (storySettings?.words?.length && chapter) {
            const lastWord = storySettings.words[storySettings.words.length - 1]
            const lastWordID = topic.words?.find(wObj => wObj.word === lastWord)?._id
            patchChapter({ id: chapter._id, item: "words", update: {word: lastWordID, topic: topic._id} })
        }
    }, [storySettings.words])

    const handleNewChapter = () => {
        createChapter({ storyID: story?._id})
        .then(data => {
            setChapter(data.chapter)
            setStorySettings(prev => prev.rebuild({ details: []}))
        })
    }

    const handleChapterNavigation = (index) => {
        setChapterIndex(index)
        setShowOutline(false)
        fetchChapter({ index, storyID: story._id })
        .then(data => {
            if (data.chapter) {
                setChapter(data.chapter)
                setUpdateFlag(true)
                setStorySettings(prev => prev.rebuild({ details: data.chapter.details }))
            }
        })
    }

    return (
        <article className="sidebar">
            <section>
                {
                    !showOutline ?
                    <article className="workspace">
                        <h1>{ parsedOutline?.title}</h1>
                        <h3>{ parsedOutline?.chapters?.[chapterIndex]?.title || "Untitled Chapter"}</h3>
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
                                <span key={i} className={storySettings.words.includes(wObj.word) ? "right-word" : "wrong-word"}>
                                    {wObj.word}{storySettings.words.filter(w => w === wObj.word).length > 1 ? <b>{`(${storySettings.words.filter(w => w === wObj.word).length}x)`}</b> : ""}
                                </span>)} 
                            </ul>
                        }
                    
                    </article> :
                    <article className="outline structured">
                        {parsedOutline ? (
                            <>
                                <h1>{parsedOutline.title}</h1>
                                {showLoglines && <p className="logline">{parsedOutline.logline}</p>}
                                {/* <p className="summary">{parsedOutline.summary}</p> */}
                                
                                {parsedOutline.chapters.map((chapter, index) => (
                                    <div key={index} className="chapter" onClick={() => handleChapterNavigation(index)}>
                                        <h2>{chapter.title}</h2>
                                        {showLoglines && <p className="logline">{chapter.logline}</p>}
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
            </section>
            <section>
                <button onClick={handleNewChapter}
                >New Chapter</button>
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
            </section>
        </article>
    )
}

export default Sidebar
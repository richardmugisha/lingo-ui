import "./Sidebar.css"
import TopicSearch from "../../../../components/TopicSearch/TopicSearch"
import { useTopicSearch } from "../../../../components/TopicSearch/useTopicSearch"
import { useState, useEffect } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"

// Function to parse the outline text into a structured object
const parseOutline = (text) => {
    if (!text) return null;
    
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
        searchValue,
        setSearchValue,
        isLoading,
        addTopic,
        removeTopic
    } = useTopicSearch(storySettings.topics, "word-filling-mode")

    const [selectedValue, setSelectedValue] = useState(null)
    const [showOutline, setShowOutline] = useState(false)
    const [showLoglines, setShowLoglines] = useState(true)
    const [outlineText, setOutlineText] = useState('')
    const [parsedOutline, setParsedOutline] = useState(null)

    // Parse outline whenever the text changes
    useEffect(() => {
        const parsed = parseOutline(outlineText);
        setParsedOutline(parsed);
    }, [outlineText]);

    return (
        <article className="sidebar">
            <section>
                {
                    !showOutline ?
                    <article className="workspace">
                        <h1>{storySettings.title || "Best title in the word "}</h1>
                        <h3>Chapter 1: Best current Chapter</h3>
                        <TopicSearch
                            topics={topics} mode="word-filling-mode"
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            suggestions={null}
                            isLoading={isLoading}
                            addTopic={addTopic}
                            removeTopic={removeTopic}
                            selectedValue={selectedValue} setValue={setSelectedValue}
                        />
                        {selectedValue &&
                            <ul className="side word-pool"> { topic?.words?.map(wObj => <span className="wrong-word">{wObj.word}</span>)} 
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
                                    <div key={index} className="chapter">
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
            
                {showOutline &&
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
                <button onClick={() => setShowOutline(!showOutline)}>
                    {showOutline ? <VisibilityOff /> : <Visibility /> }
                    Outline
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
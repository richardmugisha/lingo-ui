
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon, Summarize, Delete, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { fetchAllStories, prepareEpisode, fetchStories, deleteStories } from '../../../../api/http';
import Stats from '../stats/Stats';


const StoryCatalog = ({ topicId, setStorySettings, gameInfo }) => {
  const [scriptID, setScriptID] = useState(null)
  const [deleteList, setDeleteList] = useState([])

  const resetStory = () => {
      setStorySettings( prev => prev.rebuild({ 
        title: "", summary: "",
        mode: "create", step: "onboarding", 
        // sentenceInProgress: {sentence: "", blanked: ""},
        sentenceIndex: 1,
      }) )
    }
  
  // useEffect(() => setSelected(-1), [])

  const [ stories, setStories ] = useState(gameInfo?.stories || [])

  // useEffect(() => {
  //   if (!topicId || gameInfo?.type === "story") return
  //   fetchAllStories(topicId, gameInfo?.type || "story").then(setStories)
  //                   .catch((e) => console.log(e.msg));
  // }, [topicId])

  // setStorySettings(prev => {
  //   //console.log(prev.mode, prev.step);
  //   return prev
  // })

  useEffect(() => {
    fetchStories({})
    .then(data => setStories(data?.stories || []))
  }, [])

  const report = (kind, idx, script) => {
    // console.log(script)
    // console.log(scriptID, idx)
    const isPreviousEpReady = idx === 0 || stories[idx - 1]?.ready
    if(!isPreviousEpReady) return 
    prepareEpisode(scriptID, idx).then(() => {
      console.log(kind === 'not ready' ? "Episode coming soon!": "")
    })
  }

  const readScript = (script) => {
    setScriptID(script._id)
    setStories(script.episodes)
  }

  const handleDeleteStories = () => {
    deleteStories(deleteList)
      .then(data => {
        setDeleteList([])
        setStories(prev => prev.filter(story => !deleteList.includes(story._id)))
      })
      .catch(console.log)
  }
  
  return (
    <div className='side side-wide story-catalog'>
      {stories?.length ?
        <>
          <h1>Story Catalog </h1>
          <header>
            { deleteList.length > 0 && <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteStories}> Confirm </Button> }
          </header>
          <div className='story-catalog'>
              {stories?.map((story, i) => (
                  <span
                      key={i}
                      // onClick={() => gameInfo?.type === "story" ||
                      //   (story.script ? 
                      //     readScript(story.script)
                      //     : false) ||
                      //     (!story.script?.episodes && (!story?.ready ? report('not ready', i, story): true) && setStorySettings( prev => prev.rebuild(
                      //       {
                      //         ...story,
                      //         mode: "practice",
                      //         step: (gameInfo?.type || "story") === "story" ? "practice" : "temporary step",
                      //       }
                      //     )))
                      // }
                      
                      className="story--span"
                  >
                    <div>
                      { deleteList.length > 0 ?
                            deleteList.includes(story._id) ? 
                                  <CheckBox onClick={() => setDeleteList(prev => prev.filter(id => id !== story._id))}/> : 
                                  <CheckBoxOutlineBlank onClick={() => setDeleteList([...deleteList, story._id])}/>
                            : <span></span>
                      }
                      { deleteList.length < 1 && <Delete onClick={() => setDeleteList([story._id])}/> }
                    </div>
                    <p
                        onClick={() => {
                          setStorySettings(prev => prev.rebuild({
                            mode: "create",
                            step: "create",
                            outline: story.outline,
                            _id: story._id,
                            details: story.details,
                            ...story
                          }))
                        }}
                    >{story.script?.title || story.title}</p>
                  </span>
              ))}
              <span className="story--span" onClick={resetStory}>+</span>
          </div>
        </> :
        <>
          <p>No {pluralize(gameInfo?.type || "story")} yet!</p>
          <span className="story--span" onClick={resetStory}>+</span>
        </> 
      }
      <Stats />
    </div>
  )
}

export default StoryCatalog

const pluralize = (word) => {
  if (!word) return ""
  if (word[word.length] === "y") return word.slice(0, word.length - 1) + "ies"
  else return word + "s"
}
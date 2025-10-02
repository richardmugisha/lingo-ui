
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon, Summarize, Delete, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import ClearIcon from '@mui/icons-material/Clear';;
import { useEffect, useState } from 'react';

import { fetchAllStories, prepareEpisode, fetchStories, deleteStories } from '../../../../api/http';
import Stats from '../stats/Stats';
import Cover from './cover/Cover';


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
    <div className='story-catalog'>
      {stories?.length ?
        <>
          {/* <h1>Story Catalog </h1> */}
          <header>
            { deleteList.length > 0 && <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteStories}> Confirm </Button> }
            <Button startIcon={<AddIcon/>} onClick={resetStory}>New Story</Button>
          </header>
          <div className='covers'>
              {stories?.map((story, i) =>  <Cover story={story} deleteList={deleteList} setDeleteList={setDeleteList} setStorySettings={setStorySettings}/>)}
          </div>
          <p className='invitation'>
            These stories have been created and developed by our growing community of writers and readers. Each book represents a unique voice, perspective, and imagination, brought together to form a diverse collection. From intimate character portraits to dramatic journeys, these works are the result of shared creativity and collaboration. As our community continues to expand, so does the richness and variety of the stories we tell—each one an invitation to explore new worlds, ideas, and emotions.
          </p>
        </> :
        <>
          <p>No {pluralize(gameInfo?.type || "story")} yet!</p>
          <p>Add a new story</p>
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
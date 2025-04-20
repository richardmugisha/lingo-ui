
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon, Summarize } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { fetchAllStories } from '../../../../api/http';


const StoryCatalog = ({ topicId, setStorySettings, gameInfo }) => {

  const resetStory = () => {
      setStorySettings( prev => prev.rebuild({ 
        title: "", summary: "",
        mode: "create", step: "onboarding", details: [], 
        sentenceInProgress: {sentence: "", blanked: ""},
        sentenceIndex: 0,
      }) )
    }
  
  // useEffect(() => setSelected(-1), [])

  const [ stories, setStories ] = useState(gameInfo?.stories || [])

  useEffect(() => {
    if (!topicId || gameInfo?.type === "story") return
    fetchAllStories(topicId, gameInfo?.type || "story").then(setStories)
                    .catch((e) => console.log(e.msg));
  }, [topicId])

  setStorySettings(prev => {
    //console.log(prev.mode, prev.step);
    return prev
  })
  
  return (
    <div className='side side-wide story-catalog'>
      {stories.length ?
        <>
          <div>
            <p>Pick a story to practice with </p>
          </div>
          <div className='side-pool titles'>
              {stories?.map((story, i) => (
                  <span
                      key={i}
                      onClick={() => gameInfo?.type === "story" ||
                          setStorySettings( prev => prev.rebuild(
                            {
                              ...story,
                              mode: "practice",
                              step: (gameInfo?.type || "story") === "story" ? "practice" : "temporary step",
                            }
                          ))
                      }
                      className="story--span"
                  >
                  {story.title}
                  </span>
              ))}
          </div>
          or
        </> :
        <>No {pluralize(gameInfo?.type || "story")} yet!</> 
      }
      <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
          onClick={resetStory}
      >
          New {gameInfo?.type || "story"}
      </Button>
          
    </div>
  )
}

export default StoryCatalog

const pluralize = (word) => {
  if (!word) return ""
  if (word[word.length] === "y") return word.slice(0, word.length - 1) + "ies"
  else return word + "s"
}
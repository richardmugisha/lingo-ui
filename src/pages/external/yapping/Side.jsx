import React, { useState, useEffect} from 'react';

import { Button } from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material';

import shuffledNumbers from '../../../utils/shuffleArray';

const Side = ({ stories, setWords, words, selectedWords, setSelectedWords, currSentence, setSelected, setActivity, activity, title, setTitle, setStory, selected, correctWordSet }) => {
  const [wordSetToDisplay, setWordSetToDisplay] = useState([])
  
  useEffect(() => {
    if (correctWordSet.length && activity === 'practicing') {
      const wordsToDisplay = shuffledNumbers(words.length - 1).slice(0, 3).map((randIndex) => words[randIndex]).concat(correctWordSet)
      const randomizedOrder = shuffledNumbers(wordsToDisplay.length - 1).map(randomIndex => wordsToDisplay[randomIndex])
      setWordSetToDisplay(randomizedOrder)
    }
  }, [correctWordSet])

  return (
    <div className={`side ${activity? '': "side-wide"}`}>
        <div>
          <h3>Title: {title || '---No title yet!---'}</h3><br />
          <p>{activity === 'practicing' ? 'Use the right word(s) from this set!' : selectedWords?.length ? '': 'Pick the word(s) you are about to use!'}
          </p> <br />
        </div>
        { (!activity) ? (
          <div className='side-pool titles'>
            {stories.map((story, i) => (
              <span
                key={story.title + i}
                onClick={() => {
                  setSelected(i);
                }}
                className={`story--span ${selected === story.title ? 'selected' : ''}`}
              >
                {story.title}
              </span>
            ))}
          </div>
        ) : (
          <>
            { /*!currSentence &&*/
              <div className='side-pool word-pool'>
              {(activity === 'practicing' ? wordSetToDisplay : words).map((word, i) => (
                <span 
                  className='story--span'
                  onClick={() => { if (activity !== 'practicing') { setWords(words.filter((w, index) => index !== i)); setSelectedWords(prev => [...prev, words[i]]) } }} key={i}>
                  {word}
                </span>
              ))}
            </div>
            }
            <br />
            {
              selectedWords?.length ?
              <div className='side-pool word-pool'>
                {(selectedWords).map((word, i) => (
                  <span 
                    className='story--span'
                  >
                  {word}
                </span>
              ))}
              </div> :
              <></>
            }
          </>
          
        )}
        {
          !activity &&
          <>
            <br />
            or 
            <br /><br />
            <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
              onClick={() => {
                setActivity('creating');
                setTitle('');
                setStory('');
              }}
            >Create more stories</Button>
          </>
        }
        {/* <input
          type="submit"
          value={`${activity === 'reading' ? 'Create your story' : 'Read instead'}`}
          className='submit custom-button-1'
          onClick={() => {
            setActivity(prev => ['reading', 'creating'].find(acti => acti !== prev));
            setTitle('');
            setStory('');
          }}
        /> */}
      </div>
  )
}

export default Side

import React, { useState, useEffect} from 'react';

import { Button } from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material';

import shuffledNumbers from '../../../utils/shuffleArray';

const Side = ({ stories, setWords, words, selectedWords, setSelectedWords, okAttempt, currSentence, setSelected, setActivity, activity, setTitle, story, setStory, selected, correctWordSet }) => {
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
          {{creating: story?.length < 3, practicing: okAttempt?.split('.')?.length < 2 }[activity] &&
              <p>
                {activity === 'practicing' ? 
                              'Use the right word(s) from this set!' : 
                selectedWords?.length === 0 && 'Pick the word(s) you are about to use!'}
              </p> 
          }
        </div>
        <>
          {
            <div className='side-pool word-pool'>
            {(activity === 'practicing' ? wordSetToDisplay : words).map((word, i) => (
              <span 
                onClick={() => { if (activity !== 'practicing') { setWords(words.filter((w, index) => index !== i)); setSelectedWords(prev => [...prev, words[i]]) } }} key={i}>
                {word}
              </span>
            ))}
          </div>
          }
          {
            selectedWords.length > 0 &&
            <div className='side-pool word-pool selected'>
              {(selectedWords).map((word, i) => (
                <span key={word+i}>{word}</span>
              ))}
            </div> 
          }
        </>
      </div>
  )
}

export default Side

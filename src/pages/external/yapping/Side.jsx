import React from 'react';

import { Button } from "@mui/material"
import { Add as AddIcon, School as SchoolIcon, Quiz as QuizIcon, ContentCopy, Create } from '@mui/icons-material';

const Side = ({ stories, setWords, words, setSelected, setActivity, activity, setTitle, setStory, selected }) => {
  // console.log(selected, words)
  return (
    <div className={`side ${activity? '': "side-wide"}`}>
        <div>
          <h1>Story time</h1>
          <p>{activity ? 'Remove the word you are done using by clicking on it!':  'Pick a story to practice with' }</p> <br />
        </div>
        {/* selected < 0 && stories.length */}
        { (!activity) ? (
          <div className='side-pool titles'>
            {stories.map((story, i) => (
              <span
                key={story.title + i}
                onClick={() => {
                  setSelected(i);
                }}
                className={`story--span${selected === story.title ? 'selected' : ''}`}
              >
                {story.title}
              </span>
            ))}
          </div>
        ) : (
          <div className='side-pool word-pool'>
            {words.map((word, i) => (
              <span 
                className='story--span'
                onClick={() => setWords(words.filter((w, index) => index !== i))} key={i}>
                {word}
              </span>
            ))}
          </div>
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

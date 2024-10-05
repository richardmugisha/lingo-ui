import React, { useEffect, useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { removeKeywords } from './utils/sentenceAnalyzer';

const Story = (
  { info, setInfo,
    story, activity, 
    title, setTitle,
    currSentence, setAiHelp, aiHelp, 
    aiOptionsDisplay, setAiOptionsDisplay, 
    setChecked, checked, handlePartSelection, 
    handleSubmit, setCurrSentence,
    callUponAi
  }) => {
  
  const [attempt, setAttempt] = useState(currSentence.blanked)
  const [okAttempt, setOkAttempt] = useState('')

  useEffect(() => {
    if (attempt && attempt === currSentence.sentence) {
      setOkAttempt(okAttempt + ' ' + attempt);
      const index = currSentence.index
      if (index === story.length - 1) {
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        return
      }
      setCurrSentence({...story[index+1], index: index+1})
    }
  }, [attempt])

  useEffect(() => {
      console.log(currSentence)
      if (currSentence.blanked) setAttempt(removeKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ')))
      }

  ,[currSentence])

  // console.log(activity)
  return (
    activity &&
    <div className="story">
        {activity === 'creating' && (
          <div>
            <p>Create a story using the words / expressions </p>
            <div>
              <section>
                <span className='ai-assistant' onClick={() => setAiOptionsDisplay(!aiOptionsDisplay)}>
                  <AutoAwesomeIcon />
                  {aiHelp ? aiHelp : 'Ai assistant'}
                </span>
                {aiOptionsDisplay && (
                  <section>
                    <div>
                      <span className='summary' onClick={() => { setAiHelp('Ai co-editor'); setAiOptionsDisplay(false); }}>
                        Ai co-editor
                      </span>
                      <p>This will take turns with you in writing sentences for your story</p>
                    </div>
                    <div>
                      <span className='summary' onClick={() => { setAiHelp('Ai for you'); setAiOptionsDisplay(false); }}>
                        Ai for you
                      </span>
                      <p>This will take over the generation of the entire story for you</p>
                    </div>
                  </section>
                )}
              </section>
              <span>
                <label htmlFor="incognito" onClick={() => setChecked(!checked)}>
                  <input onChange={() => {}} className='checkbox' value={checked} type="checkbox" name="incognito" id="incognito"
                  />
                  &nbsp;incognito
                </label>
                <span tooltip='nothing'> &#9432;</span>
              </span>
              <input type="submit" value="Submit" className='submit' onClick={handleSubmit} />
            </div>
          </div>
        )}

        <input
          type="text" name="" id="" placeholder='Title of the story' className='title' value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {story.length > 0 &&
        <p id='text-container'>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            activity === 'creating' ? story.map(sentenceObj => sentenceObj.sentence).join(' ') :
            okAttempt
          }
        </p>}
        <p className='sentence'>{activity === 'creating' ? 
            currSentence.sentence && 
            currSentence.sentence.split(' ')
            .map((word, index) => 
                <label key={word + index}>
                  <span style={{background: currSentence.blanked && !currSentence.blanked.includes(word) && 'yellow'}}>{word}</span>
                  &nbsp;
                </label>
            ) : 
            attempt?.split(' ').map(
            (word, index) => {
              if (currSentence.sentence.split(' ')[index] === word) return <label>{word} </label>
              else return (
                <label key={index}>
                  {
                    word.split('').map((char, i) => {
                      const numOfPastWords = currSentence.sentence?.split(' ')?.slice(0, index)?.join(' ').length
                      // console.log(numOfPastWords, index)
                      const currCharIndex = numOfPastWords
                      const correctCondition = currSentence.sentence[currCharIndex + i + 1] === char && char !== '_'
                      // console.log(currCharIndex, char, currSentence.sentence[currCharIndex + i + 1])
                      return <span key={char + i} style={{color: correctCondition ? 'green' : 'red', textDecoration: correctCondition && 'underline'}}>{char}</span>
                    })
                  }
                  &nbsp;
                </label>
              )
              }
            )
            }
        </p>
        { ['creating', 'practicing'].includes(activity) &&
        <textarea
          placeholder='Type your story here' name="" id="" 
          value={activity === 'creating' ? currSentence.sentence: attempt[attempt?.length - 1] === '.' ? attempt : attempt + '.' }
          onChange={(e) => {
            if (activity === 'creating') setCurrSentence((prev) => ({...prev, sentence: e.target.value}))
            else if (activity === 'practicing') setAttempt(e.target.value)
          }
          }
          onKeyDown={callUponAi}
          onMouseUp={() => handlePartSelection(currSentence, setCurrSentence)}
          readOnly={info.exists && info.type === 'warning'}
        />}
      </div>
  )
}

export default Story

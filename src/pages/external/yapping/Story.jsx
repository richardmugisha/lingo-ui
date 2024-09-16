import React, { useEffect, useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
      if (currSentence.blanked)  setAttempt(currSentence.blanked)
    }
    , [currSentence])

  return (
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
        <p>{activity === 'creating' ? 
            currSentence.sentence && 
            currSentence.sentence.split(' ')
            .map((word, index) => 
                <label key={index}>
                  <span style={{background: currSentence.blanked && !currSentence.blanked.includes(word) && 'yellow'}}>{word}</span>
                  &nbsp;
                </label>
            ) : 
            attempt.split('').map(
            (char, index) => {
              const correctCondition = currSentence.sentence[index] === char && !(currSentence.blanked[index] === char) 
              const incorrectCondition = currSentence.sentence[index] !== char
              return <label key={index}>
                <span style={{color: correctCondition ? 'green' : (incorrectCondition ? 'red' : ''), textDecoration: correctCondition && 'underline'}}>{char}</span>
              </label>
              }
            )
            }
        </p>
        { ['creating', 'practicing'].includes(activity) &&
        <textarea
          placeholder='Type your story here' name="" id="" 
          value={activity === 'creating' ? currSentence.sentence: attempt }
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

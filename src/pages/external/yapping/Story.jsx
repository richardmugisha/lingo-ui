import React, { useEffect, useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { removeKeywords } from './utils/sentenceAnalyzer';

import useTextToSpeech from './utils/useTextToSpeech';

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
  
  const [attempt, setAttempt] = useState(currSentence.blanked?.split(' '))
  const [correctSentence, setCorrectSentence] = useState(currSentence.sentence?.split(' '))
  const [okAttempt, setOkAttempt] = useState('')

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    setVoice(voices[1]);
  }, [voices]);

  const sayIt = (script) => speak('Please listen: ' + script, voice);

  useEffect(() => {
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt && attempt.join(' ') === correctSentence.join(' ')) {
      setOkAttempt(okAttempt + ' ' + attempt.join(' '));
      sayIt(attempt)
      const index = currSentence.index
      if (index === story.length - 1) {
        sayIt(okAttempt)
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        return
      }
      setCurrSentence({...story[index+1], index: index+1})
    }
  }, [attempt])

  useEffect(() => {
      if (!(activity === 'practicing')) return
      console.log(currSentence.sentence?.split(' '), currSentence.blanked?.split(' '))
      const [sentenceWithoutKeywords, sentenceWithKeywords] = removeKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      // console.log(sentenceWithKeywords, sentenceWithoutKeywords)
      if (currSentence.blanked) {
        setAttempt(sentenceWithoutKeywords)
        setCorrectSentence(sentenceWithKeywords)
      }
    }
  ,[currSentence])

  console.log(activity)
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

        {activity === 'practicing' ? 
        <h3>{title}</h3>
        :
        <input
          type="text" name="" id="" placeholder='Title of the story' className='title' value={title}
          onChange={(e) => setTitle(e.target.value)}
        />}
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
                <label key={word + currSentence.sentence[index - 1] + currSentence.sentence[index + 1]}>
                  <span style={{background: currSentence.blanked && !currSentence.blanked.includes(word) && 'yellow'}}>{word}</span>
                  &nbsp;
                </label>
            ) : 
            attempt?.map(
            (word, index) => {
              if (correctSentence[index] === word) return <label key={word + index}>{word} </label>
              else return (
                <label key={word + index}>
                  {
                    word.split('').map((char, i) => {
                      const numOfPastWords = correctSentence?.slice(0, index)?.join(' ').length
                      // console.log(numOfPastWords, index)
                      const correctCondition = (correctSentence.join(' ')[numOfPastWords + i + 1] === char && char !== '_') || ['.', ',', ';', ']', '"', '!', '?', ')'].includes(char)
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
        { activity === 'practicing' ? 
        <p id='attempt-p'>
          {
          attempt.map((word, i) => {
            return word === correctSentence[i] ?
            <label key={word + i}>{word} </label>: 
            <span key={word + i}>
              <input type='text'  value={['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word.slice(0, word.length - 1) : word}
                className='attempt-input'
                onChange={e => setAttempt(prev => 
                  prev.map((word, index) => index === i ? e.target.value +  (['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word[word.length - 1] : '')
                  : word))}
              />
              {['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? <label>{word[word.length - 1]} </label> : ''}
            </span>
            }
            )
          }
        </p> :
        <textarea
          placeholder='Type your story here' name="" id="" 
          value={activity === 'creating' ? currSentence.sentence: attempt.join(' ') }
          onChange={(e) => {
            if (activity === 'creating') setCurrSentence((prev) => ({...prev, sentence: e.target.value}))
            else if (activity === 'practicing') setAttempt(e.target.value.split(' '))
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



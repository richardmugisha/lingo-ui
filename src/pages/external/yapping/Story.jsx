import { useEffect, useState, useCallback } from 'react';
import { removeKeywords } from './utils/sentenceAnalyzer';

import { Button } from '@mui/material';

import useTextToSpeech from './utils/useTextToSpeech';

const Story = (
  { selectedWords,
    info, setInfo,
    story, 
    activity, setActivity,
    okAttempt, setOkAttempt,
    title, setTitle,
    currSentence, setAiHelp, aiHelp, 
    aiOptionsDisplay, setAiOptionsDisplay, 
    setChecked, checked, handlePartSelection, 
    handleSubmit, setCurrSentence,
    callUponAi
  }) => {
  
  const [attempt, setAttempt] = useState(currSentence.blanked?.split(' '))
  const [correctSentence, setCorrectSentence] = useState(currSentence.sentence?.split(' '))
  const [winSound] = useState(new Audio("/sounds/win.wav"))
  const [cheerSound] = useState(new Audio("/sounds/cheer.wav"))

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    setVoice(voices[1]);
    return () => cancel()
  }, [voices]);

  const sayIt = useCallback((script) => activity === 'creating' ? script.join(' ') : script && speak(script, voice), [activity, voice]);

  useEffect(() => {
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt?.join(' ') === correctSentence.join(' ')) {
      const approvedAttempt = okAttempt + ' ' + attempt.join(' ')
      setOkAttempt(approvedAttempt);
      const index = currSentence.index
      if (index === story.length - 1) {
        cheerSound.play()
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        setActivity('reading')
        return sayIt(`Congratulations for completing this story. I am now going to recount the whole story for you: ${approvedAttempt}`)
      }
      // sayIt(attempt)
      setCurrSentence({...story[index+1], index: index+1})
    }
  }, [attempt])

  const updateAttempt = (e, indexOfAttemptedWord) => {
    const copyOfAttemptSplit = [...attempt]
    const wordAtThatIndex = copyOfAttemptSplit[indexOfAttemptedWord]
    let attemptedWord = e.target.value
    const wordLastCharacter = wordAtThatIndex[wordAtThatIndex.length - 1]
    const endsWithPunctuation = ['.', ',', ';', ']', '"', '!', '?', ')'].includes(wordAtThatIndex)
    attemptedWord += (endsWithPunctuation ? wordLastCharacter : '')
    copyOfAttemptSplit[indexOfAttemptedWord] = attemptedWord
    if (attemptedWord === correctSentence[indexOfAttemptedWord]) {
      winSound.play()
    }
    setAttempt(copyOfAttemptSplit)
  }

  useEffect(() => {
      if (!(activity === 'practicing')) return
      const [sentenceWithoutKeywords, sentenceWithKeywords] = removeKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      if (currSentence.blanked) {
        setAttempt(sentenceWithoutKeywords)
        setCorrectSentence(sentenceWithKeywords)
      }
    }
  ,[currSentence])

  return (
    <div className="story">
        {story.length > 0 && (!selectedWords?.length) && (activity !== 'practicing' || okAttempt)?
          <>
            {['creating', 'practicing'].includes(activity) ?
              <h3>
                Your story so far ...
              </h3> : <></>
            }
            <p id='text-container'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {
                activity === 'creating' ? story.map(sentenceObj => sentenceObj.sentence).join(' ') :
                okAttempt
              }
            </p> 
          </>
          : 
          <></>
        }
        {
          ['creating', 'practicing'].includes(activity) ?
        
          <>
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
            { 
            activity === 'practicing' ? 
              <p id='attempt-p'>
                {
                attempt.map((word, i) => {
                  return word === correctSentence[i] ?
                  <label key={word + i}>{word} </label>: 
                  <span key={word + i}>
                    <input type='text'  value={['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word.slice(0, word.length - 1) : word}
                      className='attempt-input'
                      onChange={e => updateAttempt(e, i)
                        // setAttempt(prev => 
                        // prev.map((word, index) => index === i ? e.target.value +  (['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word[word.length - 1] : '')
                        // : word))
                      }
                    />
                    {['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? <label>{word[word.length - 1]} </label> : ''}
                  </span>
                  }
                  )
                }
              </p> :
              (selectedWords?.length ?
                <textarea
                  placeholder={`Type your sentence here with ${selectedWords}`} name="" id="" 
                  value={activity === 'creating' ? currSentence.sentence: attempt.join(' ') }
                  onChange={(e) => {
                    if (activity === 'creating') setCurrSentence((prev) => ({...prev, sentence: e.target.value}))
                    else if (activity === 'practicing') setAttempt(e.target.value.split(' '))
                  }
                  }
                  onKeyDown={callUponAi}
                  onMouseUp={() => handlePartSelection(currSentence, setCurrSentence)}
                  readOnly={info.exists && info.type === 'warning'}
                /> : 
                <>
                  {
                    story?.length > 2 ?
                    <Button
                      variant="contained" color='primary' disableElevation 
                      onClick={() => setActivity('submitting')}
                    >
                      Ready to submit?
                    </Button> :
                    <></>
                  }
                </>
              )
            }
          </> :
          <></>
        }
        
      </div>
  )
}

export default Story



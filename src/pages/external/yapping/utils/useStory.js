import { useEffect, useState, useCallback } from 'react';
import { removeKeywords } from './sentenceAnalyzer';
import useTextToSpeech from './useTextToSpeech';


export default ({ 
    mode, isLeadAuthor,
    selectedWords, words,
    info, setInfo,
    story, 
    activity, setActivity,
    okAttempt, setOkAttempt,
    title, setTitle,
    currSentence, setAiHelp, aiHelp, 
    aiOptionsDisplay, setAiOptionsDisplay, 
    setChecked, checked, handlePartSelection, 
    handleSubmit, setCurrSentence,
    callUponAi, handleApproval
  }) => {
    
  const [attempt, setAttempt] = useState(currSentence.blanked?.split(' '))
  const [correctSentence, setCorrectSentence] = useState(currSentence.sentence?.split(' '))
  const [winSound] = useState(new Audio("/sounds/win.wav"))
  const [cheerSound] = useState(new Audio("/sounds/cheer.wav"))
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    if (activity == "creating") setSentenceIndex(story.length)
  }, [story])

  useEffect(() => {
    setVoice(voices[1]);
    return () => 
        {cancel(); cheerSound.pause()}
  }, [voices]);

  const sayIt = useCallback((script) => activity === 'creating' ? script.join(' ') : script && speak(script, voice), [activity, voice]);

  useEffect(() => {
    if (activity === "creating") return;
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt?.join(' ') === correctSentence.join(' ')) {
      const approvedAttempt = okAttempt + ' ' + attempt.join(' ')
      setOkAttempt(approvedAttempt);
      const index = currSentence.index;
      setSentenceIndex(sentenceIndex + 1)
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

  return {
    attempt, setAttempt, updateAttempt,
    correctSentence,
    okAttempt, activity, setActivity, currSentence, 
    setCurrSentence, story, handleApproval, handlePartSelection, callUponAi, 
    selectedWords, isLeadAuthor, mode, words,
    sentenceIndex, setSentenceIndex, 
    info
  }

}
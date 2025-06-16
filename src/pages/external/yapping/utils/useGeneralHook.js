import { useCallback, useEffect, useState } from "react";

import AxiosWrapper from "../../../../api/http/AxiosWrapper";
import { httpEndpoint } from "../../../../../serverConfig";

import handleBlanksGen from "./handleBlanks";

import StorySetup from "./storySettings";

const useGeneralHook = (
  {
    storySettings, setStorySettings,
    mode,
    info, setInfo , 
    topicId, 
    checked, 
    words,
    selectedWords, setSelectedWords,
    story, title,
    summary, attempt, setAttempt, correctSentence
  }) => {

  const [userId] = useState(JSON.parse(localStorage.getItem('user')).userId);
  const [winSound] = useState(new Audio("/sounds/win.wav"))


  useEffect(() => {
    let timerId;
    if (info?.exists) {
      timerId = setTimeout(() => {
        setInfo({exists: false})
      }, 10000);
    }

    return () => clearTimeout(timerId)
  }, [info])

  const updateAttempt = ({word, fillIndex, fillingMode, setWordLevelIndex}) => {
      const newWord = word
      const blank = fillingMode === "typing" ? attempt[fillIndex] : attempt.find(w => w.startsWith('____'))
      const newAttempt = [...attempt];
      const wordIndex = fillIndex || attempt.indexOf(blank) 
      const correctWord = correctSentence[wordIndex];
      if (correctWord === word || 
            (['.', ',', ';', ']', '"', '!', '?', ')'].includes(correctWord[correctWord.length - 1]) && 
              correctWord.slice(0, correctWord.length-1) === word
            )
          ) {
        newAttempt[wordIndex] = correctSentence[wordIndex];
        setAttempt(newAttempt)
        winSound.play()
      }
      
      else if (fillingMode === "typing") {
        setWordLevelIndex(fillIndex)
        newAttempt[fillIndex] = newWord;
        setAttempt(newAttempt)
      }
    }

    const handleSubmit = () => {
        const { title, summary, details } = storySettings;
        if (mode?.startsWith("game")) return;
        AxiosWrapper
          .post(`${ httpEndpoint }/story-time/${topicId}`, { userId: !checked ? userId : null, details, title, words: selectedWords })
          .then((res) => {
            const { story } = res.data;
            setInfo({ type: 'success', message: 'Your story was created successfully! => ' + story.title, exists: true })
            setStorySettings(new StorySetup({ step: "catalog" }))
          })
          .catch((e) => console.log(e.msg));
    };

    
      useEffect(() => {
        if (!storySettings?.sentenceInProgress) return
        const currSentence = storySettings.sentenceInProgress
        if (storySettings.mode === 'practice' || !currSentence?.sentence) return
        if (currSentence.sentence.match(/[.!?]["']?\s$/)) {
          const { blanked, usedExpressions } = handleBlanksGen(currSentence.sentence, storySettings.suggestedWords.map(wObj => wObj.word))
          partApproval({ ...currSentence, blanked})
          setStorySettings(prev => prev.rebuild({words: [...prev.words, ...usedExpressions]}))
        }
      }, [storySettings.sentenceInProgress]);
    
      const partApproval = (currSentence) => {

        setStorySettings(prev => prev.rebuild({
          details: [...prev.details, {...currSentence, blanked: currSentence.blanked || currSentence.sentence}],
          sentenceInProgress: { sentence: "", blanked: ""},
          sentenceIndex: prev.details.length
        }))
        
      }
    
      const handleApproval = useCallback((e) => {
        if ( e.type==="click" || e.key === 'ArrowRight') {
          partApproval();
          window.removeEventListener('keydown', handleApproval);
        }
      }, [partApproval]);
      
      useEffect(() => {
        return () => {
          window.removeEventListener('keydown', handleApproval);
        };
      }, [handleApproval]);

      const callUponAi = useCallback((e) => {
        const key = e.key;
        if (["Tab", "Enter"].includes(key)) e.preventDefault();
        if (key === 'Tab')  return setStorySettings(prev => prev.rebuild({ 
                              sentenceInProgress: { sentence: prev.state.sentenceInProgress.sentence + "\t" },
                      }))
        if (key === 'Enter') 
          return setStorySettings(prev => {
            if (prev.sentenceInProgress.sentence) 
              return prev.rebuild({
                        sentenceInProgress: { sentence: prev.state.sentenceInProgress.sentence + "\n" },
                      })
            return prev.rebuild({
                    details: [...prev.details, {sentence: "\n", blanked: "\n"}], 
                    sentenceInProgress: {sentence: "", blank: ""},
                    sentenceIndex: prev.details.length + 1
                  })
        }) 
        
      }, [summary, title, story])
      
    
      return { handleSubmit, callUponAi, handleApproval, updateAttempt
      }
}

export default useGeneralHook
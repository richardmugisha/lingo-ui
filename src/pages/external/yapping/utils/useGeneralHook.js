import { useCallback, useEffect, useState } from "react";

import axios from 'axios';
import API_BASE_URL from "../../../../../serverConfig";

const useGeneralHook = (
  mode,
  aiHelp, setAiHelp,
  selected, setSelected,
  currSentence, setCurrSentence, 
  activity, setActivity, 
  info, setInfo , 
  deckId, 
  checked, 
  words, setWords,
  setSelectedWords,
  story, setStory,
  title, setTitle, 
  stories, setStories,
  summary
  ) => {

  const [userId] = useState(JSON.parse(localStorage.getItem('user')).userId);

  useEffect(() => {
    if (!deckId || mode?.startsWith("game")) return
    axios
    .get(`${API_BASE_URL}/cards/story-time/${deckId}`)
    .then((res) => {
      const { stories } = res.data;
      setStories(() => {
          return stories
      })
    })
    .catch((e) => console.log(e.msg));
  }, [deckId])

  useEffect(() => {
    let timerId;
    if (info.exists) {
      timerId = setTimeout(() => {
        setInfo({exists: false})
      }, 10000);
    }

    return () => clearTimeout(timerId)
  }, [info])

  const handleSummarySubmit = useCallback((e) => {
    e.preventDefault();
    if (aiHelp === 'Ai co-editor') {
      setInfo({exists: true, type: 'info', message: 'You can start writing the story. Hit Enter whenever you need a sentence from your assistant.'})
      return
    }
    axios.post(API_BASE_URL + '/cards/story-time/' + deckId, {userId, story, title, words, aiAssistance: aiHelp, summary: summaryInput})
         .then(({ data }) => {
            const story = data.story;
            setStories((prev) => {
              setActivity('');
              setInfo({ type: 'success', message: 'Your story was created successfully! => ' + story.title, exists: true })
              return [...prev, story]
            });
            setAiHelp('')
          })
  }, [aiHelp, summary, title])

    const handleSubmit = () => {
        if (mode?.startsWith("game")) return;
        axios
          .post(`${API_BASE_URL}/cards/story-time/${deckId}`, { userId: !checked ? userId : null, story, title, words })
          .then((res) => {
            const { story } = res.data;
            console.log(story);
            setStories((prev) => {
              // setActivity('practicing');
              setActivity('');
              setInfo({ type: 'success', message: 'Your story was created successfully! => ' + story.title, exists: true })
              return [...prev, story]
            });
            setAiHelp('')
          })
          .catch((e) => console.log(e.msg));
    };
    
      useEffect(() => {
        // console.log(activity, currSentence)
        if (activity === 'practicing' || !currSentence.sentence) return
        if ( ['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) {
          setInfo({ exists: true, type: 'warning', message: 'Select the part of this sentence that resembles one of the words in your deck',
          });
        }
      }, [currSentence.sentence, activity]);
    
      const handlePartSelection = useCallback(() => {
        if (activity === 'practicing' || !currSentence.sentence) return
        if ( !['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) return;
        const part = window.getSelection().toString();
        if (part) {
          setCurrSentence( prev => ({...prev, blanked : prev.blanked ? prev.blanked.replace(part, '-'.repeat(part.length)) : prev.sentence.replace(part, '-'.repeat(part.length)) }) )
          setInfo({
            exists: true,
            type: 'warning',
            message: 'Thank you for selecting.\nIf you are satisfied with your selection, press > to write your next sentence',
          });
          
          if (!currSentence.blanked) return () => window.addEventListener('keydown', handleApproval);
          // window.addEventListener('keydown', handleApproval);
          // return () => window.addEventListener('keydown', handleApproval);
        }
      }
    ,[currSentence, setCurrSentence, activity]);
    
      const partApproval = useCallback(() => {
        setInfo({ exists: false });
        setStory((prev) => [...prev, currSentence] );
        setCurrSentence({sentence: '', blanked: ''});
        setSelectedWords([])
      }, [currSentence.blanked])
    
      const handleApproval = useCallback((e) => {
        if ( e.type==="click" || e.key === 'ArrowRight') {
          partApproval();
          window.removeEventListener('keydown', handleApproval);
        }
      }, [partApproval]);
      
      useEffect(() => {
        // window.addEventListener('keydown', handleApproval);
        return () => {
          window.removeEventListener('keydown', handleApproval);
        };
      }, [handleApproval]);

      const callUponAi = useCallback((e) => {
        const key = e.key;
        if (["Tab", "Enter"].includes(key)) e.preventDefault();
        if (key === 'Tab') return setCurrSentence(prev => ({...prev, sentence: prev.sentence + "\t"}))
        if (key === 'Enter') return setCurrSentence(prev => {
          console.log(prev)
          if (prev.sentence) return {...prev, sentence: prev.sentence + "\n"}; 
          setStory(prev => [...prev, {sentence: "\n", blanked: "\n"}]); return prev
        }) 
        if (false) {
          if (!summary) {
            return setInfo({exists: true, type: 'warning', message: 'Enable your ai assistant to use it!'})
          }
          else { // the summary exists
            axios.post(API_BASE_URL + '/cards/story-time/' + deckId, {userId, story: story.map(sent => sent.sentence).join(' '), title, words, aiAssistance: aiHelp, summary})
                 .then(({data}) => {
                    const {title, aiSentence} = data.story;
                    if (title) setTitle(title)
                    if (aiSentence) setCurrSentence(aiSentence)
                 })
                 .catch(error => console.log(error))
          }
        }
      }, [summary, title, story])
      
    
      useEffect(() => {
          // console.log(stories.length, selected, !selected)
          if (stories.length && selected > -1)  setActivity('practicing'); 
          const current = stories[selected];
          if (current) {
            setTitle(current.title);
            setStory(current.story);
            setWords(current.words)
            //console.log(current.story[0])
            setCurrSentence({...current.story[0], index: 0})
          }
      }, [selected, stories]);

      return { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi, handleApproval
      }
}

export default useGeneralHook
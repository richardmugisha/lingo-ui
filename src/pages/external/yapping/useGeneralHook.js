import { useCallback, useEffect, useState } from "react";

import axios from 'axios';

const generalHook = (
  aiHelp, setAiHelp,
  selected, setSelected,
  currSentence, setCurrSentence, 
  activity, setActivity, 
  info, setInfo , 
  deckId, 
  checked, 
  words, setWords,
  story, setStory,
  title, setTitle, 
  stories, setStories
  ) => {

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [userId] = useState(JSON.parse(localStorage.getItem('user')).userId);
  const [summary, setSummary] = useState('')

  useEffect(() => {
    axios
    .get(`${baseUrl}/api/v1/cards/story-time/${deckId}`)
    .then((res) => {
      const { stories } = res.data;
      setStories(() => {
          setActivity(stories.length === 0 ? 'creating': 'practicing'); 
          return stories
      })
      console.log(stories, res);
    })
    .catch((e) => console.log(e.msg));
  }, [])

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
    const summaryInput = document.getElementById('Yapping--summary').value;
    const titleInput = document.getElementById('Yapping--title').value;
    document.getElementById('Yapping--form').style.display = 'none'
    setSummary(summaryInput); setTitle(titleInput);
    if (aiHelp === 'Ai co-editor') {
      setInfo({exists: true, type: 'info', message: 'You can start writing the story. Hit Enter whenever you need a sentence from your assistant.'})
      return
    }
    axios.post(baseUrl + '/api/v1/cards/story-time/' + deckId, {userId, story, title, words, aiAssistance: aiHelp, summary: textInput})
         .then(({ data }) => {
            const story = data.story;
            setStories((prev) => {
              setActivity('practicing');
              return [...prev, story]
            });
            setAiHelp('')
          })
  }
, [aiHelp])

    const handleSubmit = () => {
        console.log(deckId);
        axios
          .post(`${baseUrl}/api/v1/cards/story-time/${deckId}`, { userId: !checked ? userId : null, story, title, words })
          .then((res) => {
            const { story } = res.data;
            console.log(story);
          })
          .catch((e) => console.log(e.msg));
    };
    
      useEffect(() => {
        // console.log(activity, currSentence)
        if (activity === 'practicing') return
        if ( ['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) {
          setInfo({ exists: true, type: 'warning', message: 'Select the part of this sentence that resembles one of the words in your deck',
          });
        }
      }, [currSentence.sentence, activity]);
    
      const handlePartSelection = useCallback(() => {
        if (activity === 'practicing') return
        if ( !['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) return;
        const part = window.getSelection().toString();
        if (part) {
          setCurrSentence( prev => ({...prev, blanked : prev.blanked ? prev.blanked.replace(part, '-'.repeat(part.length)) : prev.sentence.replace(part, '-'.repeat(part.length)) }) )
          setInfo({
            exists: true,
            type: 'warning',
            message: 'Thank you for selecting.\nIf you are satisfied with your selection, press > to write your next sentence',
          });
    
          // window.addEventListener('keydown', handleApproval);
          return () => window.addEventListener('keydown', handleApproval);
        }
      }
    ,[currSentence, setCurrSentence, activity]);
    
      const partApproval = useCallback(() => {
        setInfo({ exists: false });
        setStory((prev) => [...prev, currSentence] );
        setCurrSentence({sentence: '', blanked: ''});
      }, [currSentence.blanked])
    
      const handleApproval = useCallback((e) => {
        if (e.key === 'ArrowRight') {
          partApproval();
          window.removeEventListener('keydown', handleApproval);
        }
      }, [partApproval]);
      
      useEffect(() => {
        window.addEventListener('keydown', handleApproval);
        return () => {
          window.removeEventListener('keydown', handleApproval);
        };
      }, [handleApproval]);

      const callUponAi = useCallback((e) => {
        const key = e.key;
        if (key === 'Enter') {
          if (!summary) {
            return setInfo({exists: true, type: 'warning', message: 'Enable your ai assistant to use it!'})
          }
          else { // the summary exists
            axios.post(baseUrl + '/api/v1/cards/story-time/' + deckId, {userId, story: story.map(sent => sent.sentence).join(' '), title, words, aiAssistance: aiHelp, summary})
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
          console.log(stories.length, selected, !selected)
          if (stories.length && selected < 0) return setSelected(0);
          const current = stories[selected];
          if (current) {
            setTitle(current.title);
            setStory(current.story);
            setWords(current.words)
            //console.log(current.story[0])
            setCurrSentence({...current.story[0], index: 0})
          }
      }, [selected, stories]);

      return { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi}
}

export default generalHook
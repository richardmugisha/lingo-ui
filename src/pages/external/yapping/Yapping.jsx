import { useEffect, useState } from 'react';
import './Yapping.css';
import Side from './Side';
import StoryCatalog from './story-catalog/StoryCatalog';
import Onboarding from './creation-onboarding/Onboarding';
import Story from './Story';
import Submission from './story-submission/Submission';

import generalHook from './useGeneralHook';
import { useSelector } from 'react-redux';
import { getKeywords } from './utils/sentenceAnalyzer';

import usePageRefreshHandle from "../../../utils/usePageRefreshHandle"

import Info from '../../../components/Info'

const Yapping = () => {
  const handleRefresh = usePageRefreshHandle()
  const { words: cards, _id: deckId } = useSelector((state) => state.deck.openDeck);
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(cards.map((cardObj) => cardObj['related words'][Math.floor(Math.random() * cardObj['related words'].length)]).slice(0, 30))
  }, [cards])

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  const [story, setStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);
  const [activity, setActivity] = useState(''); // creating or practicing
  const [selected, setSelected] = useState(-1); // story index
  const [aiHelp, setAiHelp] = useState('');
  const [aiOptionsDisplay, setAiOptionsDisplay] = useState(false);
  const [currSentence, setCurrSentence] = useState({sentence: '', blanked: ''});
  const [selectedWords, setSelectedWords] = useState([])
  const [okAttempt, setOkAttempt] = useState('')

  const [info, setInfo] = useState({ type: '', message: '', exists: false });

  const { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi} = generalHook(aiHelp, setAiHelp,
    selected, setSelected,
    currSentence, setCurrSentence, 
    activity, setActivity, 
    info, setInfo,
    deckId, 
    checked, 
    words, setWords,
    setSelectedWords,
    story, setStory,
    title, setTitle, 
    stories, setStories)

  return (
    <div className='Yapping'>
      {
        {creating: story?.length < 3, practicing: okAttempt?.split('.')?.length < 3 }[activity] || !activity ?
        <h1>Story time</h1> : <></>
      }
      {info.exists && (
        <Info info={info} id='Yapping--info' />
      )}
      {aiHelp &&
        <form action="" className='Yapping--summary' id='Yapping--form' onSubmit={handleSummarySubmit}>
          <label htmlFor="">Title: <input type="text" id='Yapping--title' placeholder='optional' /></label>
          <p>Provide a short summary of your story to guide your assistant</p>
          <textarea name="" id="Yapping--summary"></textarea>
          <input type="submit" value='Start' className='Yapping--button'/>
        </form>
      }
      {activity ? <h3>Title: {title || '---No title yet!---'}</h3> : <></>}
      {
        stories?.length && !activity ?
        <StoryCatalog 
          stories={stories}
          setSelected={setSelected} selected={selected}
          setActivity={setActivity}
          setTitle={setTitle} 
          setStory={setStory}
        /> :
        <></>
      }
      {
        ['creating', 'practicing'].includes(activity) &&
        <Side 
        stories={stories}
        words={words} setWords={setWords} 
        selectedWords={selectedWords} setSelectedWords={setSelectedWords}
        okAttempt={okAttempt}
        currSentence={currSentence.sentence}
        setSelected={setSelected} selected={selected}
        setActivity={setActivity} activity={activity} 
        story={story} setStory={setStory}
        correctWordSet={activity === 'practicing' && getKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))}
        />
      }
      { activity==='onboarding' &&
        <Onboarding 
          setAiHelp={setAiHelp} aiHelp={aiHelp}
          title={title} setTitle={setTitle}
          aiOptionsDisplay={aiOptionsDisplay} setAiOptionsDisplay={setAiOptionsDisplay}
          setActivity={setActivity}
        />
      }
      {
        ['creating', 'practicing', 'reading'].includes(activity) &&
        <Story 
          selectedWords={selectedWords}
          info={info} setInfo={setInfo}
          story={story} 
          activity={activity} setActivity={setActivity}
          title={title} setTitle={setTitle}
          okAttempt={okAttempt} setOkAttempt={setOkAttempt}
          currSentence={currSentence} setCurrSentence={setCurrSentence}
          setAiHelp={setAiHelp} aiHelp={aiHelp} 
          setChecked={setChecked} checked={checked}
          setAiOptionsDisplay={setAiOptionsDisplay} aiOptionsDisplay={aiOptionsDisplay} 
          handlePartSelection={handlePartSelection} 
          handleSubmit={handleSubmit} 
          callUponAi={callUponAi}
        />
      }
      {
        activity === 'submitting' && 
        <Submission 
          title={title} setTitle={setTitle}
          story={story}
          checked={checked} setChecked={setChecked}
          handleSubmit={handleSubmit}
        />
      }

    </div>
  );
};

export default Yapping;

import React, { useEffect, useState } from 'react';
import './Yapping.css';
import Side from './Side';
import Story from './Story';
import generalHook from './useGeneralHook';
import { useSelector } from 'react-redux';
import { getKeywords } from './utils/sentenceAnalyzer';

const Yapping = () => {
  const { words: cards, _id: deckId } = useSelector((state) => state.deck.openDeck);
  const [words, setWords] = useState(
    cards.map((cardObj) => cardObj['related words'][Math.floor(Math.random() * cardObj['related words'].length)])
  );

  const [story, setStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);
  const [activity, setActivity] = useState(''); // reading or creating
  const [selected, setSelected] = useState(-1); // story index
  const [aiHelp, setAiHelp] = useState('');
  const [aiOptionsDisplay, setAiOptionsDisplay] = useState(false);
  const [currSentence, setCurrSentence] = useState({sentence: '', blanked: ''});

  const [info, setInfo] = useState({ type: '', message: '', exists: false });

  const { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi} = generalHook(aiHelp, setAiHelp,
    selected, setSelected,
    currSentence, setCurrSentence, 
    activity, setActivity, 
    info, setInfo,
    deckId, 
    checked, 
    words, setWords,
    story, setStory,
    title, setTitle, 
    stories, setStories)

  // useEffect(() => console.log(story) , [story])

  return (
    <div className='Yapping'>
      {info.exists && (
        <div className={`Yapping--info Yapping--info-${info.type}`} id='Yapping--info'>
          {info.message}
        </div>
      )}
      {aiHelp &&
        <form action="" className='Yapping--summary' id='Yapping--form' onSubmit={handleSummarySubmit}>
          <label htmlFor="">Title: <input type="text" id='Yapping--title' placeholder='optional' /></label>
          <p>Provide a short summary of your story to guide your assistant</p>
          <textarea name="" id="Yapping--summary"></textarea>
          <input type="submit" value='Start' className='Yapping--button'/>
        </form>
      }
      <Side 
        stories={stories}
        words={words} setWords={setWords} 
        setSelected={setSelected} selected={selected}
        setActivity={setActivity} activity={activity} 
        setTitle={setTitle} 
        setStory={setStory}
        correctWordSet={getKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' '), currSentence)}
        />
      <Story 
        info={info} setInfo={setInfo}
        story={story} activity={activity} 
        title={title} setTitle={setTitle}
        currSentence={currSentence} setCurrSentence={setCurrSentence}
        setAiHelp={setAiHelp} aiHelp={aiHelp} 
        setChecked={setChecked} checked={checked}
        setAiOptionsDisplay={setAiOptionsDisplay} aiOptionsDisplay={aiOptionsDisplay} 
        handlePartSelection={handlePartSelection} 
        handleSubmit={handleSubmit} 
        callUponAi={callUponAi}
        />
    </div>
  );
};

export default Yapping;

import { useEffect, useState } from 'react';
import isEqual from "lodash/lodash";

import './Yapping.css';
import Side from './Side';
import StoryCatalog from './story-catalog/StoryCatalog';
import Onboarding from './creation-onboarding/Onboarding';
import ChatOnboarding  from './chat-onboarding/Onboarding';
import Story from './Story';
import Submission from './story-submission/Submission';
import useGeneralHook from './utils/useGeneralHook';
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords } from './utils/sentenceAnalyzer';

import usePageRefreshHandle from "../../../utils/usePageRefreshHandle"

import Info from '../../../components/Info'

import StorySetup from './utils/storySettings';

const Yapping = ({ gameInfo, setGameInfo, userID }) => {
  const handleRefresh = usePageRefreshHandle()
  const { learning, _id: topicId, words:cards } = useSelector((state) => state.topic);
  const [words, setWords] = useState(learning.words.map((wordObj) => wordObj.word).slice(0, 20) || [] ); // 20 words

  console.log(learning)

  // useEffect(() => {
  //   // if (mode?.startsWith("game")) return;
  //   setWords(learning.words.map(wordObj => wordObj.word)?.slice(0, 20))
  // }, [learning])

  // useEffect(() => {
  //   handleRefresh(topicId)
  // }, [topicId])  

  const [ storySettings, setStorySettings ] = useState(new StorySetup(gameInfo?.data || {mode: "create", step: "catalog", words, details: []})) 

  const areObjValuesDifferent = (obj1, obj2, keys) => {
    if (Object.keys(obj1).length && Object.keys(obj2).length) return keys.map(k => obj1[k] !== obj2[k]).some(v => v)
  }

  useEffect(() => {
    if ( gameInfo && areObjValuesDifferent(gameInfo.data, storySettings, ["title", "summary", "step", "sentenceIndex"])) {
      setGameInfo(prev => {
        const copyOfGameInfo = { ...prev }
        if (storySettings.step === "submit" && copyOfGameInfo.status === "in progress") {
          copyOfGameInfo.status = "post-game";
          copyOfGameInfo.statusHistory.push("in progress")
        }
        copyOfGameInfo.data = {...storySettings.metadata, ...storySettings.state}
        copyOfGameInfo.source = userID
        console.log("altered game")
        return copyOfGameInfo
      })
    }
  }, [storySettings])

  useEffect(() => {
    if (gameInfo?.source !== userID) {
      console.log("altered story")
      setStorySettings( new StorySetup(gameInfo.data || {}))
    }
  }, [gameInfo])

  const [checked, setChecked] = useState(false);
  const [selectedWords, setSelectedWords] = useState([])
  const [okAttempt, setOkAttempt] = useState("")
  const [attempt, setAttempt] = useState([])
  const [correctSentence, setCorrectSentence] = useState([])
  const [correctWordSet, setCorrectWordSet] = useState([])

  const [info, setInfo] = useState({ type: '', message: '', exists: false });

  const { handleSubmit, callUponAi, updateAttempt } = useGeneralHook(
    {
    storySettings, setStorySettings,
    info, setInfo,
    topicId, checked, 
    words, setWords,
    selectedWords, setSelectedWords,
    attempt, setAttempt, correctSentence
  }
  )

  useEffect(() => {
    if (storySettings.state?.mode === 'practice') 
      setCorrectWordSet(
        getKeywords(
          storySettings.sentenceInPractice.sentence?.split(' '), 
          storySettings.sentenceInPractice.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      )
  }, [storySettings?.sentenceInPractice])

  // console.log(storySettings, gameInfo?.data)
  return (
    <div className='Yapping'>
      {
        {create: storySettings.details?.length < 3, practice: okAttempt?.split('.')?.length < 2 }[storySettings.mode] || !storySettings.mode ?
        <h1>{gameInfo?.type || "story"} time</h1> : <></>
      }
      {info.exists && (
        <Info info={info} id='Yapping--info' />
      )}
      {(storySettings.mode && storySettings.title || gameInfo?.data?.title) ? <h3>Title: {storySettings.title || gameInfo?.data?.title}</h3> : <></>}
      {
        storySettings.step === "catalog" ?
        <StoryCatalog 
          topicId = {topicId}
          setStorySettings={setStorySettings}
          gameInfo={gameInfo}
        /> :
        <></>
      }
      {
        ['create', 'practice'].includes(storySettings.mode) && ['create', 'practice'].includes(storySettings.step) &&
        <Side 
          selectedWords={selectedWords} 
          okAttempt={okAttempt}
          correctWordSet={correctWordSet}
          updateAttempt={updateAttempt}
          storySettings={storySettings}
        />
      }
      { storySettings.mode === "create" && storySettings.step ==='onboarding' &&
        (
          gameInfo?.type === "story"?
          <Onboarding 
            storySettings={storySettings} setStorySettings={setStorySettings}
            gameInfo={gameInfo} userID={userID}
          /> 
          :
          <ChatOnboarding 
            storySettings={storySettings} setStorySettings={setStorySettings}
            gameInfo={gameInfo} userID={userID}
          />
        )
      }
      {
        ['create', 'practice', 'read'].includes(storySettings.mode) && ['create', 'practice', 'read'].includes(storySettings.step) && (!gameInfo || gameInfo.type === "story") &&
        <Story 
          storySettings={storySettings} setStorySettings={setStorySettings}
          info={info} setInfo={setInfo}
          okAttempt={okAttempt} setOkAttempt={setOkAttempt}
          callUponAi={callUponAi}
          attempt={attempt} setAttempt={setAttempt}
          correctSentence={correctSentence} setCorrectSentence={setCorrectSentence}
          updateAttempt={updateAttempt}
        />
      }
      {
        storySettings.step === 'submit' && 
        <Submission 
          storySettings={storySettings} setStorySettings={setStorySettings}
          gameInfo={gameInfo} setGameInfo={setGameInfo}
          userID={userID}
          checked={checked} setChecked={setChecked}
          handleSubmit={handleSubmit}
        />
      }

    </div>
  );
};

export default Yapping;

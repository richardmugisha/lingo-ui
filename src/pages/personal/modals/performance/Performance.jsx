import React, { useEffect, useRef, useState } from 'react';
import "./Performance.css"

import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import { School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';
import createScript from '../../../../api/http/chat/createScript';

import { useDispatch, useSelector } from 'react-redux';
import { updateLearning } from '../guided-learning/utils/useLearning';

const perfEmojis = ['😥', '😔', '😬', '😌', '🤠',  '🤠', '😎', '🤩']
const perfLabels = ['Really??', "C'mon", 'Are you for real?', 'practice more', 'fair', 'good', "Sheesh", 'No way']

import { CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL } from '../../../../constants';
import { masteryUpdate } from '../../../../api/http';

const Performance = ({ wins, entireTopic, topicLearnChunk, mode, setUserDecision }) => {
  const [correct, setCorrect] = useState(null)

  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const dispatch = useDispatch()
  const { _id: topicId } = useSelector(state => state.topic)
  
  const uploadingRight = useRef(true)
  const navigate = useNavigate();

  const perfRefs = [-1, 20, 40, 60, 80, 95, 99]


  useEffect(() => {
    setCorrect(wins.filter(card => card.result > 0).length);
  
    if (mode !== "guided-learning") return;
  
    let chunkLevel = topicLearnChunk.chunkLevel;
    let topicLevel = topicLearnChunk.topicLevel;
    let chunkIndex = topicLearnChunk.chunkIndex;
  
    // Utility: Get chunk words and apply a level
    const getChunkWordsAtLevel = (index, level) => {
      return entireTopic
        .slice(index * CHUNK_SIZE, index * CHUNK_SIZE + CHUNK_SIZE)
        .map(word => ({ word: word._id, level }));
    };
  
    // Compute new levels from wins
    let wordsMasteriesList = wins.map(win => ({
      word: win.word,
      level: win.level + win.result
    }));
  
    const levelUp = wordsMasteriesList.every(word => word.level > chunkLevel);
  
    if (levelUp) {
      chunkLevel++;
      
      // If chunk is mastered, move to next chunk
      if (chunkLevel % CHUNK_TARGET_MASTERY_LEVEL === 0) {
        chunkIndex++;

        createScript(null, null, wins.map(win => win.text), null, topicLearnChunk.topic)
  
        const completedOneLoop = chunkIndex === Math.ceil(entireTopic.length / CHUNK_SIZE);
  
        if (completedOneLoop) {
          chunkIndex = 0;
          topicLevel += CHUNK_TARGET_MASTERY_LEVEL; // Advance wave
        }
  
        // Reset chunk level to baseline (new topicLevel)
        chunkLevel = topicLevel;
        wordsMasteriesList = getChunkWordsAtLevel(chunkIndex, chunkLevel);
      }
    } else {
      // User failed a few → drop chunk level
      chunkLevel = Math.max(0, chunkLevel - 1);
      if (chunkLevel === 0 && topicLevel > 0) {
        topicLevel -= 1;
      }
      
      wordsMasteriesList = getChunkWordsAtLevel(chunkIndex, chunkLevel);
    }
  
    console.log({
      wordsMasteriesList,
      chunkLevel,
      topicLevel,
      chunkIndex,
      CHUNK_TARGET_MASTERY_LEVEL,
      CHUNK_SIZE
    });
  
    (async () => {
      if (!uploadingRight.current) return;
      uploadingRight.current = false;
  
      try {
        const result = await masteryUpdate({
          ...topicLearnChunk,
          words: wordsMasteriesList,
          chunkLevel,
          topicLevel,
          chunkIndex
        });
  
        updateLearning(dispatch, topicLearnChunk.topic, entireTopic);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [wins]);
  
  

  const perfGauge = (correct, wins) => {
    const perf = Math.round(correct * 100 /wins.length)
    perfRefs.push(perf)
    perfRefs.sort((a, b) => a - b)
    // //console.log([perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]])
    return [perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]]
  }

  return (
    <div className='performance'>
      <div className="performance--title">Performance</div><hr />
      <div className="performance--body">
        <div className="amount">
          <div className="label">Correct</div>
          <div className="number">{`${correct}/${wins?.length}`}</div>
          {/* <div className="display" style={{color: amountUp?'greenyellow':'red' }}>{ amountUp?<TrendingUpIcon />:<TrendingDownIcon />}</div> */}
        </div>
        <div className="speed">
          {/* <div className="label">Performance</div> */}
          {/* <div className="number">{conclusion}{emoji}</div> */}
          <div className="number">{perfGauge(correct, wins)[0]}{perfGauge(correct, wins)[1]}</div>
          {/* <div className="display" style={{color: speedUp?'greenyellow':'red'}}>{ speedUp?<TrendingUpIcon />:<TrendingDownIcon /> }</div> */}
        </div>
        <div className="time">
          <div className="label">Accuracy</div>
          <div className="number">{Math.round(correct * 100 /wins.length)}%</div>
          {/* <div className="display" style={{color: timeUp?'red':'greenyellow'}}>{ timeUp?<TrendingUpIcon />:<TrendingDownIcon /> }</div> */}
        </div>
      </div>
      <div className="performance--foot">
        <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../learning/?topic=${topicId}`)}>Revise the topic</Button>
        <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => ["guided-learning"].includes(mode) ? setUserDecision('') : insane(navigate, topicId)}>Continue</Button>
      </div>
    </div>
  )
}
export default Performance

const insane = (navigate, topicId) => {
  //console.log(topicId)
  const timerId = setTimeout(() => {
    navigate(`?topic=${topicId}`)
  }, 500);

  return () => clearTimeout(timerId)
}
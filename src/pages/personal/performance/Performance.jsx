import React, { useEffect, useRef, useState } from 'react';
import './Performance.css'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import { School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { openDeck } from '../../../features/personal/deck/deckSlice';

const perfEmojis = ['😥', '😔', '😬', '😌', '🤠',  '🤠', '😎', '🤩']
const perfLabels = ['Really??', "C'mon", '', 'practice more', 'fair', 'good', "Sheesh", 'No way']

const CHUNK_SIZE = 10       // Number of words to learn at a time
const CHUNK_TARGET_MASTERY_LEVEL = 4; // level to reach before going to the next chunk

import API_BASE_URL from '../../../../serverConfig';

const Performance = ({ wins, entireDeck, deckLearnChunk, autoMode, setUserDecision }) => {
  const [correct, setCorrect] = useState(null)

  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const dispatch = useDispatch()
  
  const uploadingRight = useRef(true)
  const navigate = useNavigate();

  const perfRefs = [-1, 20, 40, 60, 80, 95, 99]


  useEffect(()=>{
    setCorrect(wins.filter(card => card.result > 0).length)
    if (!autoMode) return 
    const wordsMasteriesList = wins.map(word => ({_id: word._id, level: word.level + word.result }))
    let newWordSet = deckLearnChunk.words.map(word => word._id)
    let { level, chunkIndex } = deckLearnChunk
    let levelUp = false
    if (wordsMasteriesList.every(word => word.level > deckLearnChunk.level)) {
      level++
      if ( level > 0 && level % CHUNK_TARGET_MASTERY_LEVEL === 0 ) {
        if ((chunkIndex + 1) * CHUNK_SIZE < entireDeck.length) { // if moving to the next chunk, increment chunk index, and reset level to the baseline of the current level
          chunkIndex++;
          level -= CHUNK_TARGET_MASTERY_LEVEL
        } else { // if done with round through the deck, start at chunk zero maintaining the level
          chunkIndex = 0
        }
        levelUp = true
        newWordSet = entireDeck.slice(chunkIndex * CHUNK_SIZE, chunkIndex * CHUNK_SIZE + CHUNK_SIZE).map(word => word._id)
      }
    }

    console.log(wordsMasteriesList, deckLearnChunk);

    (async (wordsMasteriesList, deckId, deckLearnChunk) => {
      if (uploadingRight.current === false) return
      uploadingRight.current = false;
      try {
        const result = await uploadMasteryUpdates(wordsMasteriesList, deckId, deckLearnChunk)
        dispatch(openDeck(result.deck))
        console.log(result.msg, result.deck)
      } catch (error) { console.log(error) }
    })(wordsMasteriesList, deckLearnChunk.deckId, {...deckLearnChunk, words: newWordSet, level, chunkIndex, levelUp})

  }, [wins])

  const uploadMasteryUpdates = async (wordsMasteriesList, deckId, deckLearnChunk) => {
    try {
       const performData = await axios.patch(`${API_BASE_URL}/cards/deck?deckId=${deckId}&userId=${userId}`, { wordsMasteriesList, deckLearnChunk });
       return performData.data
    } catch (error) {
       throw error
    }
 };

  const perfGauge = (correct, wins) => {
    const perf = Math.round(correct * 100 /wins.length)
    perfRefs.push(perf)
    perfRefs.sort((a, b) => a - b)
    // console.log([perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]])
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
        <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate('../card/learn')}>Revise the deck</Button>
        <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => setUserDecision('')}>Take another quiz</Button>
      </div>
    </div>
  )
}
export default Performance

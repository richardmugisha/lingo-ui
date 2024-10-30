import React, { useEffect, useRef, useState } from 'react';
import {TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import './Performance.css'
import axios from 'axios';
import Spinner from 'react-spinner-material';
import ProgressBar from "@ramonak/react-progress-bar";

import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import { Add as AddIcon, School as SchoolIcon, Quiz as QuizIcon, ContentCopy, Create } from '@mui/icons-material';



import API_BASE_URL from '../../../../serverConfig';

const Performance = ({deckName, deckId, perf, givenTime, duration, wins, all }) => {
  const [correct, setCorrect] = useState(null)
  const [progress, setProgress] = useState(null)
  const [ready, setReady ] = useState(true);
  
  const uploading = useRef(false)
  const navigate = useNavigate();

  const perfLabels = ['terrible', 'very bad', 'bad', 'practice more', 'fair', 'good', 'very good', 'wonderful']
  const perfRefs = [0, 20, 40, 60, 80, 95, 100]
  const perfEmojis = ['😥', '😔', '😬', '😌', '',  '🤠', '😎', '🤩']
  
  const getMetadata = async (correct, speed, time) => {
    try {
      return 
    } catch (error) {
      throw new Error(error)
    }
  }
  
  useEffect(() => {
    if (uploading.current) return;
  
    const fetchData = async () => {
       try {
          
       } catch (error) {
          console.log(error);
       }
    };
 
    const uploadData = async () => {
       uploading.current = true;
       try {
       } catch (error) {
          console.log(error);
       }
    };
 
    fetchData();
    uploadData();
  }, []);


  // const conclusion = perfLabels[perfRefs.indexOf(overAllPerf)]
  // const emoji = perfEmojis[perfRefs.indexOf(overAllPerf)]

  useEffect(()=>{
    setCorrect(wins.filter(card => card.result > 0).length)
    setProgress(wins.reduce((acc, curr) => acc + curr.level + curr.result , 0) * 100 / (wins.length * 8) )
  }, [wins])

  const perfGauge = (correct, wins) => {
    const perf = Math.round(correct * 100 /wins.length)
    perfRefs.push(perf)
    perfRefs.sort((a, b) => a - b)
    console.log([perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]])
    return [perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]]
  }

  return (
    <>
    { ready ? 
    <div className='performance'>
      <div className="performance--title">Performance</div><hr />
      <div className="performance--progress">
        <ProgressBar completed = {progress > 0 ? Math.round(progress) : 2} bgColor = {'gold'} transitionDuration='1s'/>
      </div>
      <div className="performance--body">
        <div className="amount">
          <div className="label">Correct</div>
          <div className="number">{`${correct}/${wins?.length}`}</div>
          {/* <div className="display" style={{color: amountUp?'greenyellow':'red' }}>{ amountUp?<TrendingUpIcon />:<TrendingDownIcon />}</div> */}
        </div>
        <div className="speed">
          <div className="label">Performance</div>
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
        <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate('../card/guided-learn')}>Take another quiz</Button>
      </div>
    </div> :
    <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
    }
    </>
  )
}
export default Performance

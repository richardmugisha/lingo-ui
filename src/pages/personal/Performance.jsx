import React, { useEffect, useRef, useState } from 'react';
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import './Performance.css'
import axios from 'axios';
import Spinner from 'react-spinner-material';

const Performance = ({deckName, givenTime, duration, correctAnswers, all }) => {
  const [amountUp, setAmountUp] = useState(false);
  const [speedUp, setSpeedUp] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [ready, setReady ] = useState(false);
  
  const uploading = useRef(false)

  const perfLabels = ['terrible', 'very bad', 'bad', 'practice more', 'fair', 'good', 'very good', 'wonderful']
  const perfRefs = [0, 20, 40, 60, 80, 95, 100]
  const perfEmojis = ['😥', '😔', '😬', '😌', '',  '🤠', '😎', '🤩']
  const baseUrl = "https://flashcard-api-hy23.onrender.com";

  const getMetadata = async (correct, speed, time) => {
    try {
      const performData =  await axios.get(`${baseUrl}/api/v1/cards/deckMetadata/${ deckName }`);
      const data = performData.data.deckMetadata
      //console.log(data)
      if (!data) return [true, true, false] // if no reference, we assume we are progressing
      const perf = data.performance;
      
      return { correctStatus: correct > (perf.correct[perf.correct.length-1]), speedStatus: speed > perf.performance[perf.performance.length-1], time: time > perf.time[perf.performance.length-1]}
    } catch (error) {
      throw new Error(error)
    }
  }
  
  let overAllPerf = (correctAnswers/all)/(duration / givenTime) * 100

  useEffect(() => {
    if (uploading.current) return;
  
    const fetchData = async () => {
       try {
          const data = await getMetadata(correctAnswers * 100 / all, overAllPerf, duration);
          console.log(data);
          setAmountUp(data.correctStatus);
          setSpeedUp(data.speedStatus);
          setTimeUp(data.time);
          setReady(true);
       } catch (error) {
          console.log(error);
       }
    };
 
    const uploadData = async (correct, speed, time) => {
       uploading.current = true;
       try {
          console.log('...uploading', uploading);
          const performData = await axios.patch(`${baseUrl}/api/v1/cards/deckMetadata/${deckName}`, { correct, performance: speed, time });
          console.count(performData.data);
       } catch (error) {
          console.log(error);
       }
    };
 
    fetchData();
    uploadData(correctAnswers * 100 / all, overAllPerf, duration);
 }, []);

  overAllPerf = Math.floor(overAllPerf)

  perfRefs.push(overAllPerf)
  perfRefs.sort((a, b) => a - b)
  const conclusion = perfLabels[perfRefs.indexOf(overAllPerf)]
  const emoji = perfEmojis[perfRefs.indexOf(overAllPerf)]
  return (
    <>
    { ready ? 
    <div className='performance'>
      <div className="performance--title">Performance</div>
      <div className="performance--body">
        <div className="amount">
          <div className="label">Correct</div>
          <div className="number">{`${Math.floor(correctAnswers*100/all)}%`}</div>
          <div className="display"><i style={{color: amountUp?'greenyellow':'red' }}>{ amountUp?<FiTrendingUp />:<FiTrendingDown />}</i></div>
        </div>
        <div className="speed">
          <div className="label">Performance</div>
          <div className="number">{conclusion}{emoji}</div>
          <div className="display"><i style={{color: speedUp?'greenyellow':'red'}}>{ speedUp?<FiTrendingUp />:<FiTrendingDown /> }</i></div>
        </div>
        <div className="time">
          <div className="label">Time</div>
          <div className="number">{`${Math.floor(duration)}s`}</div>
          <div className="display"><i style={{color: timeUp?'red':'greenyellow'}}>{ timeUp?<FiTrendingUp />:<FiTrendingDown /> }</i></div>
        </div>
      </div>
      <div className="performance--foot">Check results</div>
    </div> :
    <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
    }
    </>
  )
}
export default Performance

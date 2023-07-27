import React from 'react';
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import './Performance.css'

const Performance = ({ givenTime, duration, correctAnswers, all }) => {
  const amountUp = false;
  const speedUp = false;
  const timeUp = false;

  const perfLabels = ['terrible', 'very bad', 'bad', 'practice more', 'fair', 'good', 'very good', 'wonderful']
  const perfRefs = [0, 20, 40, 60, 80, 95, 100]
  const perfEmojis = ['😥', '😔', '😬', '😌', '',  '🤠', '😎', '🤩']

  const overAllPerf = Math.floor((correctAnswers/all)/(duration / givenTime) * 100);
  console.log(correctAnswers, duration, givenTime, all, overAllPerf)
  perfRefs.push(overAllPerf)
  //console.log(perfRefs)
  perfRefs.sort((a, b) => a - b)
  //console.log(perfRefs)
  const conclusion = perfLabels[perfRefs.indexOf(overAllPerf)]
  const emoji = perfEmojis[perfRefs.indexOf(overAllPerf)]
  return (
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
    </div>
  )
}
export default Performance


import React, { useEffect, useState } from 'react'
import Progressbar from "@ramonak/react-progress-bar"
import './Stats.css'
import {
    generatePastYearDates,
    mergeContributionData,
    groupByWeeks,
    getColor
} from "./util";

import { fetchUserContribution, fetchUserGoal } from "../../../../api/http"

// Placeholder data
const streak = 7 // days
const contributionData = [
  // 7 days x 5 weeks (35 days)
  [1, 0, 2, 3, 0, 1, 0],
  [0, 1, 0, 2, 1, 0, 1],
  [2, 1, 3, 0, 1, 2, 0],
  [1, 0, 1, 2, 0, 1, 3],
  [0, 2, 1, 0, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  
]
const trendData = [
  { date: '2024-06-01', words: 120 },
  { date: '2024-06-02', words: 200 },
  { date: '2024-06-03', words: 150 },
  { date: '2024-06-04', words: 300 },
  { date: '2024-06-05', words: 250 },
  { date: '2024-06-06', words: 180 },
  { date: '2024-06-07', words: 220 },
]

// Simple GitHub-style grid
const ContributionTableau = ({ data }) => (
  <div className="contribution-tableau">
    {data.map((week, i) => (
      <div key={i} className="contribution-week">
        {week.map((val, j) => {
          let level = val === 0 ? '' : `level-${Math.min(val, 5)}`
          return (
            <div
              key={j}
              className={`contribution-cell ${level}`}
              title={`Day ${j + 1}, Week ${i + 1}: ${val} stories`}
            />
          )
        })}
      </div>
    ))}
    
  </div>
)

function ContributionsGrid({ data }) {
    const rawGrid = generatePastYearDates();
    const filledGrid = mergeContributionData(rawGrid, data);
    const weeks = groupByWeeks(filledGrid);
  
    return (
      <div style={{ display: 'flex' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column' }}>
            {week.map((day, di) => (
              <div
                className='contribution-cell'
                key={di}
                style={{
                  backgroundColor: getColor(day.count),
                }}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
}
  

// Simple trend line (placeholder, replace with chart lib for real)
const TrendLine = ({ data }) => (
  <div className="trend-line-container">
    <svg width={300} height={100}>
      {/* Draw line */}
      {data.map((point, i) => {
        if (i === 0) return null
        const prev = data[i - 1]
        const x1 = ((i - 1) / (data.length - 1)) * 280 + 10
        const y1 = 90 - (prev.count / 300) * 80
        const x2 = (i / (data.length - 1)) * 280 + 10
        const y2 = 90 - (point.count / 300) * 80
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#22c55e"
            strokeWidth={2}
          />
        )
      })}
      {/* Draw points */}
      {data.map((point, i) => {
        const x = (i / (data.length - 1)) * 280 + 10
        const y = 90 - (point.count / 300) * 80
        return (
          <circle key={i} cx={x || 2} cy={y || 2} r={3} fill="#22c55e" />
        )
      })}
    </svg>
  </div>
)

const Stats = () => {
    const [statYr, setStatYr] = useState(new Date().getFullYear())
    const [data, setData] = useState([])
    const [goalData, setGoalData ] = useState({})
    const [trendData, setTrendData] = useState([])
    const { userId: userID } = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        fetchUserContribution(userID, statYr)
            .then(data => {
                setData(data || []);
                if (statYr == new Date().getFullYear()) {
                    setTrendData(data || [])
                }
            })

    }, [statYr])

    useEffect(() => {
        fetchUserGoal(userID)
        .then(data => setGoalData(data?.goal || {}))
    }, [])
  return (
    trendData?.length > 0 ?
    <div className="stats-container">
        <section>
          <h3>Streak </h3>
            <Progressbar height='10px' completed={Math.round(goalData.streak?.value * 100 / goalData.current?.days)} labelColor='transparent'/>
            <span> {goalData?.streak?.value} 🔥</span>
        </section>
        <section>
          <h3>Contributions</h3>
          <div className="stats-section" >
              <ContributionsGrid data={data} />
              <div className='contribution-yrs'>
                  {statYr !== new Date().getFullYear() && <button onClick={() => setStatYr(statYr + 1)}>{statYr+1}</button>}
                  <button className='selected'>{statYr}</button>
                  {[1,2].map(offset => (
                      <button key={statYr - offset} onClick={() => setStatYr(statYr - offset)}>{statYr - offset}</button>
                  ))}
              </div>
          </div>
        </section>
        <section>
          <h3>Trend</h3>
          <TrendLine data={trendData} />
        </section>
    </div> :
    <></>
  )
}

export default Stats
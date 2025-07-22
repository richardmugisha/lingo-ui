
import React, { useEffect, useState } from 'react'
import Progressbar from "@ramonak/react-progress-bar"
import { Settings as SettingsIcon, ArrowForward,  ArrowForwardIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import './Stats.css'
import {
    generatePastYearDates,
    mergeContributionData,
    groupByWeeks,
    getColor,
    truncateToUTCDate
} from "./util";

import { fetchUserContribution, fetchUserGoal, patchUserWritingGoal } from "../../../../api/http"

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
    const [editGoal, setEditGoal] = useState(false)
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

    useEffect(() => {
      if (!goalData.upcoming?.startDate) return;

      const today = truncateToUTCDate(new Date());
      const upcomingStart = new Date(goalData.upcoming.startDate);

      // If the upcoming goal should start today or earlier
      if (upcomingStart <= today) {
        const newGoal = {
          ...goalData,
          current: { ...goalData.upcoming },
          upcoming: null,
        };
        setGoalData(newGoal);
        patchUserWritingGoal(userID, newGoal);
      }
      // Only run this effect when goalData changes after fetch
      // eslint-disable-next-line
    }, [goalData.upcoming?.startDate]);

    const handleUpdateGoalData = (field, value) => {
      if (field === "startDate" && goalData.current && value) {
        const inputDate = new Date(value);
        const currentStart = new Date(goalData.current.startDate);
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + (goalData.current.days || 1) - 1);
        if (inputDate <= currentEnd) {
          return console.error("Chosen date comes before the end of the current goal");
        }
      }

      const oldNext = goalData.upcoming || { startDate: truncateToUTCDate(new Date()), wordsPerDay: 300, days: 1 };

      switch (field) {
        case "startDate":
          oldNext.startDate = truncateToUTCDate(new Date(value));
          break;
        case "wordsPerDay":
          oldNext.wordsPerDay = value;
          break;
        case "days":
          oldNext.days = value;
          break;
        default:
          break;
      }

      const newGoal = { ...goalData, upcoming: oldNext }
      setGoalData(newGoal);

      patchUserWritingGoal(userID, newGoal)
    }

  const handleOvercomeDays = () => {
    if (!goalData.current?.startDate || !goalData.current?.days) return 0;
    const start = new Date(goalData.current.startDate);
    const today = truncateToUTCDate(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + goalData.current.days - 1);

    // If before start, 0 days overcome
    if (today < start) return 0;

    // If after end, all days overcome
    if (today > end) return goalData.current.days;

    // Days completed so far (including today)
    return Math.min(goalData.current.days, Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleDaysUntilUpcomingGoal = () => {
    if (!goalData.upcoming?.startDate) return 0;
    const today = truncateToUTCDate(new Date());
    const upcomingStart = new Date(goalData.upcoming.startDate);
    // If the upcoming goal starts today or in the past, return 0
    if (upcomingStart <= today) return 0;
    // Days left until the upcoming goal starts (exclusive of today)
    return Math.ceil((upcomingStart - today) / (1000 * 60 * 60 * 24));
  };

  return (
    trendData?.length > 0 ?
    <div className="stats-container">
        <section>
            <div>
              <h3>Streak </h3>
              <span> {goalData?.streak?.value} 🔥</span>
            </div>
            {editGoal &&
              <div className='goal-editor'>
                <span>
                  <h3>Current Goal</h3>
                  <p>{goalData.current.days} days</p>
                  <p>{goalData.current.wordsPerDay} words per day</p>
                </span>
                <span>
                  <h3>Next Goal</h3>
                  {goalData.upcoming &&
                  <>
                    <p>Starts on {new Date(goalData.upcoming.startDate).toDateString()}</p>
                    <p>Will last  {goalData.upcoming.days} days</p>
                    <p>{goalData.upcoming.wordsPerDay} words per day</p>
                    <p>Get ready in {handleDaysUntilUpcomingGoal()} days</p>
                  </>}
                </span>
                <span>
                  <h3>Edit next goal</h3>
                  <input type="date" style={{ fontSize: "1em", padding: "0.2em", borderRadius: "0.3em", border: "1px solid #ccc" }} onChange={e => handleUpdateGoalData("startDate", e.target.value)} />
                  <div style={{ marginTop: "0.5em" }}>
                    <label htmlFor="goal-duration" style={{ marginRight: "0.5em" }}>Words Per Day:</label>
                    <input id="goal-duration" type="number" min="1" value={goalData.upcoming?.wordsPerDay || 300}  style={{ width: "4em", fontSize: "1em", padding: "0.2em", borderRadius: "0.3em", border: "1px solid #ccc" }}  onChange={e => handleUpdateGoalData("wordsPerDay", e.target.value)} />
                  </div>
                  <div style={{ marginTop: "0.5em" }}>
                    <label htmlFor="goal-duration" style={{ marginRight: "0.5em" }}>Goal duration (days):</label>
                    <input id="goal-duration" type="number" min="1"  value={goalData.upcoming?.days || 1} style={{ width: "4em", fontSize: "1em", padding: "0.2em", borderRadius: "0.3em", border: "1px solid #ccc" }}  onChange={e => handleUpdateGoalData("days", e.target.value)} />
                  </div>
                  <Button onClick={() => setEditGoal(false)}>Done</Button>
                </span>
              </div>}
            <div onClick={() => setEditGoal(true)}>
              <Progressbar height='1.5em' width='10em' completed={90} customLabel={`CURRENT GOAL => ${handleOvercomeDays()}/${goalData.current?.days}`} bgColor='green' labelSize='.6em'/>
              <label htmlFor="">{ handleDaysUntilUpcomingGoal() ? `Next goal in ${handleDaysUntilUpcomingGoal()}` : "Add Next goal" }</label>
              <ArrowForwardIos />
            </div>
            
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
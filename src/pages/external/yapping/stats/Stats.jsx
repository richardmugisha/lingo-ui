
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

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'


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

// Helper to pad the days array for GitHub-style grid
function padDaysForGrid(days, weekStartsOn = 0) { // 0 = Sunday, 1 = Monday
  // Find the weekday of the first day
  const firstDay = new Date(days[0].date);
  let firstWeekday = firstDay.getUTCDay();
  if (weekStartsOn === 1) firstWeekday = (firstWeekday + 6) % 7; // shift so Monday=0

  // Pad at the start
  const padStart = Array(firstWeekday).fill(null);

  // Find the weekday of the last day (today)
  const lastDay = new Date(days[days.length - 1].date);
  let lastWeekday = lastDay.getUTCDay();
  if (weekStartsOn === 1) lastWeekday = (lastWeekday + 6) % 7;

  // Pad at the end (so last week is always full)
  const padEnd = Array(6 - lastWeekday).fill(null);

  return [...padStart, ...days, ...padEnd];
}

// Weekday labels for the grid
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LABEL_POSITIONS = [1, 3, 5]; // Mon, Wed, Fri (0-based, adjust if week starts on Monday)

function ContributionsGrid({ data, goalData }) {
  const rawGrid = generatePastYearDates();
  const filledGrid = mergeContributionData(rawGrid, data);
  const paddedDays = padDaysForGrid(filledGrid, 0); // 0 for Sunday, 1 for Monday
  const weeks = groupByWeeks(paddedDays);

  return (
    <div style={{ display: 'flex' }}>
      {/* Weekday labels */}
      <div className="days-labels" style={{ display: 'flex', flexDirection: 'column', marginRight: '0.5em' }}>
        {WEEKDAY_LABELS.map((label, idx) =>
          LABEL_POSITIONS.includes(idx) ? (
            <span key={label} style={{ height: '1em', fontSize: '0.8em', color: '#888', marginBottom: '0.2em' }}>{label}</span>
          ) : (
            <span key={label} style={{ height: '1em', marginBottom: '0.2em' }} />
          )
        )}
      </div>
      {/* Contribution grid */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column' }}>
          {week.map((day, di) =>
            day ? (
              <div
                className='contribution-cell'
                key={di}
                style={{
                  backgroundColor: getColor(day.count),
                }}
                title={`${day.date}: ${Math.round(day.count * goalData.current?.wordsPerDay)} words`}
              />
            ) : (
              <div className='contribution-cell' key={di} style={{ backgroundColor: 'transparent' }} />
            )
          )}
        </div>
      ))}
    </div>
  );
}
  

// Simple trend line (placeholder, replace with chart lib for real)


const TrendChart = ({ data, goalData }) => {
  // Create a map of existing dates to their counts for quick lookup
  const dataMap = new Map();
  data.forEach(point => {
    const dateStr = new Date(point.date).toISOString().split('T')[0];
    dataMap.set(dateStr, Math.round(point.count * goalData.current?.wordsPerDay));
  });

  // Get the start date (first date in data) and today's date
  const startDate = new Date(data[0].date);
  const today = new Date();
  
  // Generate all dates from start to today
  const completeData = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const count = dataMap.has(dateStr) ? dataMap.get(dateStr) : 0;
    
    completeData.push({
      date: new Date(currentDate).toISOString(),
      count: count
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <ResponsiveContainer width={300} height={100}>
      <LineChart
        data={completeData}
        margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
      >
        {/* Full grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#ccc"
          horizontal={true}
          vertical={true}
        />

        {/* X axis (hidden or not) */}
        <XAxis dataKey="date" hide />

        {/* Y axis scaled from 0 to 1.5 */}
        <YAxis domain={[0, 1.5]} hide />

        {/* Median line at 1.0 */}
        <ReferenceLine y={goalData.current?.wordsPerDay} stroke="#22c55e" strokeWidth={2} />

        {/* User trend */}
        <Line
          type="monotone"
          dataKey="count"
          stroke="#448"
          strokeWidth={2}
          dot={{ r: 3, stroke: "#fff", strokeWidth: 1 }}
          isAnimationActive={false}
        />

        <Tooltip 
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}




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
                    setTrendData(data || []);

                    // --- Streak check logic ---
                    if (data && data.length > 0 && goalData?.streak) {
                        // Find the last contribution date with count > 0
                        const lastContribution = [...data].reverse().find(d => d.count > 0);
                        if (lastContribution) {
                            const lastDate = new Date(lastContribution.date);
                            const now = new Date();
                            const diffMs = now - lastDate;
                            const diffHrs = diffMs / (1000 * 60 * 60);

                            if (diffHrs > 48 && goalData.streak.value !== 0) {
                                // Reset streak and patch
                                const newGoal = {
                                    ...goalData,
                                    streak: { ...goalData.streak, value: 0 }
                                };
                                setGoalData(newGoal);
                                patchUserWritingGoal(userID, newGoal);
                            }
                        }
                    }
                    // --- end streak check ---
                }
            })
    }, [statYr, userID, goalData]);

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

      console.log(goalData)

      const oldNext = goalData.upcoming || { startDate: truncateToUTCDate(new Date()), wordsPerDay: 300, days: 1 };

      switch (field) {
        case "startDate":
          oldNext.startDate = truncateToUTCDate(new Date(value)).toDateString();
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
      console.log(newGoal)
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
                <hr />
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
                <hr />
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
          <div className="months-labels"></div>
          <div className="stats-section" >
              <div className="days-labels"></div>
              <ContributionsGrid data={data} goalData={goalData} />
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
          <TrendChart data={trendData} goalData={goalData}/>
        </section>
    </div> :
    <></>
  )
}

export default Stats
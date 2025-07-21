
function generatePastYearDates() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 364);
    start.setUTCHours(0, 0, 0, 0);
  
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push({
        date: current.toISOString().slice(0, 10), // "YYYY-MM-DD"
        count: 0,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
}


function mergeContributionData(grid, rawData) {
    const dataMap = new Map(
      rawData.map(d => [d.date.slice(0, 10), d.count])
    );
  
    return grid.map(day => ({
      ...day,
      count: dataMap.get(day.date) || 0
    }));
}
  
function groupByWeeks(days) {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }

function getColor(count) {
    if (count === 0) return 'transparent';
    if (count < .4) return '#c6e48b';
    if (count < .6) return '#7bc96f';
    if (count < .8) return '#239a3b';
    return '#196127';
  }

export {
    generatePastYearDates,
    mergeContributionData,
    groupByWeeks,
    getColor
}
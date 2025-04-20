

export default (setQuizDone, btmProSize, setBtmProSize, delayId, cardTime, quizType, topicLearnChunk, setCard, changeCard, setSelectedItem) => {
    if (btmProSize == 0) return
    delayId = setTimeout(() => {
      setQuizDone(() => {
        if (btmProSize < 100) {
              const nextCard = topicLearnChunk[Math.round(btmProSize * topicLearnChunk.length/100)] // in case it doesn't have a synonym for ex
              //console.log(topicLearnChunk)
              if (!nextCard[quizType]) return setBtmProSize(prev =>  Math.round((Math.round(prev*topicLearnChunk.length/100) + 1) * 100/topicLearnChunk.length) )
              setCard(topicLearnChunk[Math.round(btmProSize * topicLearnChunk.length/100)]);
              changeCard('>')
              setSelectedItem({})
              return false
        } else {
              return true
        }
      })
    }, 100)
}
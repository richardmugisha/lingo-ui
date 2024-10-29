

export default (setQuizDone, btmProSize, setBtmProSize, delayId, quizType, deckLearnChunk, setCard, changeCard, setSelectedItem) => {
    if (btmProSize == 0) return
    setQuizDone(() => {
        if (btmProSize < 100) {
            delayId = setTimeout(() => {
              const nextCard = deckLearnChunk[Math.round(btmProSize * deckLearnChunk.length/100)] // in case it doesn't have a synonym for ex
              console.log(nextCard, '..............')
              if (!nextCard[quizType]) return setBtmProSize(prev =>  Math.round((Math.round(prev*deckLearnChunk.length/100) + 1) * 100/deckLearnChunk.length) )
              setCard(deckLearnChunk[Math.round(btmProSize * deckLearnChunk.length/100)]);
              changeCard('>')
              setSelectedItem({})
            }, 1500) //format.content.type === 'mcq' ? 1500: 0);
          return false
        } else {
          return true
        }
    })
}
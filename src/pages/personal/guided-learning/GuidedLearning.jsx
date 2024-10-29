import React, { useState, useEffect } from 'react'

import quizFormat from '../quiz/quiz-selector/quizFormat'

import QuizCard from '../quiz/quiz-card/QuizCard'

import { useSelector } from 'react-redux'

const formatRouter = (level) => {
  if (level === 0 ) return {
    quizLength: 'short',
    route: 'quiz-short-guess',
    quizType: 'meaning'
  } 
  if (level === 1 ) return  {
    quizLength: 'short',
    route: 'quiz-short-guess',
    quizType: 'example'
  }
  if (level === 2 ) return {
    quizLength: 'long',
    route: 'quiz-long-guess',
    quizType: 'meaning'
  }
  if (level === 3 ) return {
    quizLength: 'long',
    route: 'quiz-long-guess',
    quizType: 'example'
  }
  if (level === 4 ) return {
    quizLength: 'short',
    route: 'quiz-short-mcq',
    quizType: 'meaning'
  }
  if (level === 5 ) return {
    quizLength: 'short',
    route: 'quiz-short-mcq',
    quizType: 'example'
  }
  if (level === 6 ) return {
    quizLength: 'long',
    route: 'quiz-long-mcq',
    quizType: 'meaning'
  }
  if (level === 7 ) return {
    quizLength: 'long',
    route: 'quiz-long-mcq',
    quizType: 'example'
  }
  if (level === 8 ) return {
    quizLength: 'short',
    route: 'quiz-long-mcq',
    quizType: 'synonym'
  }

}

const GuidedLearning = () => {
  const [cardIndex, setCardIndex] = useState(0)
  const [format, setFormat] = useState(null)
  const [quizLength, setQuizLength] = useState(null)
  const [quizType, setQuizType] = useState(null)
  const { _id: deckId, deckName, words, learning } = useSelector(state => state.deck.openDeck)
  console.log(learning)

  useEffect(() => {
    const level = learning.words[cardIndex].level.level
    const { route, quizType, quizLength } = formatRouter(level)
    setFormat(quizFormat(route))
    setQuizLength(quizLength)
    setQuizType(quizType)
  }, [cardIndex])

  return (
    format && quizLength && quizType && <QuizCard format={format} quizType={quizType} quizLength={quizLength} order={[0]} deckLearnChunk={learning.words} autoMode={true} formatRouter={formatRouter}/>
  )
}

export default GuidedLearning

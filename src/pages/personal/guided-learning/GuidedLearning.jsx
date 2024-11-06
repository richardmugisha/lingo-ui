import React, { useState, useEffect } from 'react'

import quizFormat from '../quiz/quiz-selector/quizFormat'

import QuizCard from '../quiz/quiz-card/QuizCard'

import CardLearn from '../card-learn/CardLearn'

import { useSelector } from 'react-redux'

const formatRouter = (level) => {
  if (level < 1 ) return {
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
  const { _id: deckId, deckName, words, learning } = useSelector(state => state.deck.openDeck)
  const [craming, setCraming] = useState(learning.level % 4 === 0)

  return (
    craming ?
    <CardLearn deckLearningChunk={{deckName, words: learning.words}}  setCraming={setCraming} /> :
    learning.words.length && <QuizCard importedFormat={'placeholder'} importedQuizType={'placeholder'} importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={learning} autoMode={true} formatRouter={formatRouter} setCraming={setCraming} />
  )
}

export default GuidedLearning

import React, { useState } from 'react';
import CommonCard from '../../../components/CommonCard';
import quiz from './quiz';

import './Quiz.css';

import shuffledNumbers from '../../../utils/shuffleArray';

import { useSelector, useDispatch } from 'react-redux';
import { setQuizType, setOrder, setQuizLength, setFormat } from '../../../features/personal/quiz/quizSlice';

const Quiz = () => {
  const dispatch = useDispatch()
  const deck  = useSelector(state => state.deck.openDeck)

  const order = shuffledNumbers(deck.words.length-1)
  dispatch(setOrder(order))

  const [questionTypes, setQuestionTypes] = useState(['mcq', 'guess'])
  const [answerTypes, setAnswerTypes] = useState(['meaning', 'example', 'synonym', 'antonym']);
  const [answerLengths, setAnswerLengths] = useState(['short', 'long'])
  const [quizOn, setQuizOn ] = useState(false)

  const handleSubmit = () => {
    const route = `quiz-${answerLengths[0]}-${questionTypes[0]}`;
    const format = quiz(route)
    dispatch(setFormat(format));
    dispatch(setQuizLength(route.split('-')[1]));

    dispatch(setQuizType(answerTypes[0]));
    setQuizOn(true)
  }

  return (
       !quizOn ?
        <div className='quiz'>
          <h1 className="quiz-head">Choose one everywhere</h1>
          <div className="quiz-body">
            <div className="quiz-question-type">
                <div className="title">Type of question</div>
                <div className="content">
                    { questionTypes.map((item) => {
                      return <button className='quiz-QT custom-button-1' key={item} onClick={(e) => setQuestionTypes([item])}>{item}</button>
                    })}
                </div>
            </div>
            <div className="quiz-answer-type">
                <div className="title">Type of answer</div>
                <div className="content">{answerTypes.map((item) => {return <button className='quiz-AT custom-button-1' key={item}  onClick={(e) => setAnswerTypes([item])}>{item}</button>})}</div>
            </div>
            <div className="quiz-answer-length">
                <div className="title">Length of answer</div>
                <div className="content">{
                  answerLengths.map((item) => {
                    return <button className='quiz-AL custom-button-1' key={item} onClick={(e) => setAnswerLengths([item])}>{item}</button>
                  })
                }</div>
            </div>
          </div>
          <input className="quiz-submit" onClick={() => {handleSubmit()}} type='submit' value={'submit'} />
        </div> 
       :
      <CommonCard />
  )
}

export default Quiz

import React, { useState } from 'react';
import './Quiz.css'

const Quiz = ({ setModalSelect, setQuizType }) => {
  const [questionTypes, setQuestionTypes] = useState(['mcq', 'guess', 'speaking', 'storytelling'])
  const [answerTypes, setAnswerTypes] = useState(['meaning', 'example', 'synonym', 'antonym']);
  const [answerLengths, setAnswerLengths] = useState(['short', 'long'])

  const handleSubmit = () => {
    if (questionTypes[0] === 'speaking') {
      setModalSelect('speechQuiz')
    } 
    else {
      const route = `quiz-${answerLengths[0]}-${questionTypes[0]}`;
      setModalSelect(route)
    }
    
    setQuizType(answerTypes[0]);
    
  }

  return (
        <div className='quiz'>
          <div className="quiz-head">Choose one everywhere</div>
          <div className="quiz-body">
            <div className="quiz-question-type">
                <div className="title">type of question</div>
                <div className="content">
                    { questionTypes.map((item) => {
                      return <div className='quiz-QT' key={item} onClick={(e) => setQuestionTypes([item])}>{item}</div>
                    })}
                </div>
            </div>
            <div className="quiz-answer-type">
                <div className="title">type of answer</div>
                <div className="content">{answerTypes.map((item) => {return <div className='quiz-AT' key={item}  onClick={(e) => setAnswerTypes([item])}>{item}</div>})}</div>
            </div>
            <div className="quiz-answer-length">
                <div className="title">length of answer</div>
                <div className="content">{
                  answerLengths.map((item) => {
                    return <div className='quiz-AL' key={item} onClick={(e) => setAnswerLengths([item])}>{item}</div>
                  })
                }</div>
            </div>
          </div>
          <div className="quiz-submit" onClick={() => {handleSubmit()}}>Submit</div>
        </div>
  )
}

export default Quiz

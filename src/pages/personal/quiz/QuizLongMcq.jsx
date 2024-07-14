import React from 'react';
import CommonCard from '../../../components/CommonCard';
import shuffledNumbers from '../../../utils/shuffleArray';

const QuizLongMcq = ({quizType, deck}) => {
    const format = {
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'what is meaning/usage of:',
        //secondWordUnderTopProgressbar: 'algorithm',
        type: 'noun',
        content: {
          type: 'mcq',
          correctAnswer: "Mugisha is the lion king. he is a beast",
          body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit.", "Lorem ipsum dolor sit amet consectetur adipisicing elit.","Mugisha is the lion king. he is a beast", "Lorem ipsum dolor sit amet consectetur adipisicing elit."]
        },
        bottomProgressbar: true,
    }

    const order = shuffledNumbers(deck.length-1)
  return (
    <CommonCard format={format} quizType={quizType} quizLength="long" deck={deck} order={order}/>
  )
}

export default QuizLongMcq

import React from 'react';
import CommonCard from '../../components/CommonCard';

const QuizShortGuess = () => {
    const format = {
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'guess the word for:',
        content: {
          type: 'guess',
          body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit."]
        },
        bottomProgressbar: true,
    }
  return (
    <CommonCard format={format} />
  )
}

export default QuizShortGuess

import React from 'react';
import CommonCard from '../../components/CommonCard';

const QuizLongGuess = () => {
    const format = {
        aboveTopProgressbar: "Guess ...",
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'guess the meaning of:',
        word: 'algorithm is the way',
        type: 'idiom',
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

export default QuizLongGuess

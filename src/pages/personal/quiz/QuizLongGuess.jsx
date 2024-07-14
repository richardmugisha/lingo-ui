import React from 'react';
import CommonCard from '../../../components/CommonCard';
import shuffledNumbers from '../../../utils/shuffleArray';

const QuizLongGuess = ({ deckName, quizType, deck}) => {
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

    const order = shuffledNumbers(deck.length-1)
    
  return (
    <CommonCard deckName={deckName} format={format} deck={deck} order={order} quizType={quizType} quizLength = "long"/>
  )
}

export default QuizLongGuess

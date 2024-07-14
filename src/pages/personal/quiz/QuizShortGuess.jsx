import React from 'react';
import CommonCard from '../../../components/CommonCard';
import shuffledNumbers from '../../../utils/shuffleArray';

const QuizShortGuess = ({ deckName, quizType, deck}) => {
    
    const format = {
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'guess the word for:',
        content: {
          type: 'guess',
          body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit."]
        },
        bottomProgressbar: true,
    }
    const order = shuffledNumbers(deck.length-1)
  return (
    <CommonCard deckName={deckName} format={format} deck={deck} order={order} quizType={quizType} quizLength = "short"/>
  )
}

export default QuizShortGuess

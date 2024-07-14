import React from 'react';
import CommonCard from '../../../components/CommonCard';
import shuffledNumbers from '../../../utils/shuffleArray';

const QuizShortMcq = ({ deckName, quizType, deck}) => {
    const format = {
      label0: false, // the text above the top progressbar,
      label1: false, // the first text below the progressbar,
      label2: false, // the second text below the progressbar,
      label3: false, // the word above the bottom progressbar if there is
      label4: false, // the word under teh btm progressbar,
      topProgressbar: true,
      btmProgressbar: true,
      content: {
        type: 'mcq',
        },
    }
  
    const order = shuffledNumbers(deck.length-1)
    console.log(order)
    
  return (
      <CommonCard deckName={deckName} format={format} deck={deck} order={order} quizType={quizType} quizLength = "short"/>
  )
}

export default QuizShortMcq

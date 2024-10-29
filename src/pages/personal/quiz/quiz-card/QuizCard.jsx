import React, { useEffect } from 'react';

import Performance from '../../performance/Performance'
import GuessCard from '../quiz-start/guess/GuessCard';
import McqCard from '../quiz-start/mcq/McqCard';

import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from 'react-spinner-material';
import './QuizCard.css';

import useQuizCard from './useQuizCard';


const QuizCard = ({quizType, quizLength, order, deckLearnChunk, autoMode, formatRouter }) => {

    const   {
      correctOption, 
      selectedItem,
      optionArray,
      quizDone,
      topProSize,
      btmProSize,
      cardFormat,
      timePerCard,
      cardMotion,
      deck,
      deckId,
      colors,
      handleItemClick,
      blankedWordFinder,
      card,
      format
    } = useQuizCard(quizType, quizLength, order, deckLearnChunk, autoMode, formatRouter)

    useEffect(() => {
        console.log('>>>>>>>>>>>>>>>>>  ', format?.content?.type || format?.content)
    }, [format?.content?.type])

    return (
         deck ?
          quizDone ? <Performance deckName={deckName} deckId={deckId} perf={performance} givenTime={allocatedTime} duration={ (topProSize * allocatedTime /100) + (deckLearnChunk.length - 1) * allocatedTime } correctAnswers={deckLearnChunk.length} all={deckLearnChunk.length} /> :
          <>
            { format?.topProgressbar && <ProgressBar completed = {Math.floor(topProSize)} bgColor = {colors(topProSize)} customLabel=' ' height='2px' transitionDuration='.5s'/> }
            {format?.content?.type === 'mcq' ?
              <McqCard correctOption={correctOption} selectedItem={selectedItem} cardMotion={cardMotion} blankedWordFinder={blankedWordFinder} cardFormat={cardFormat} optionArray={optionArray} handleItemClick={handleItemClick} card={card} quizLength={quizLength} quizType={quizType}/>
              :
              <GuessCard cardMotion={cardMotion} cardFormat={cardFormat} btmProSize={btmProSize} handleItemClick={handleItemClick} topProSize={topProSize} quizLength={quizLength} quizType={quizType}/>
            }
            { format?.btmProgressbar && <ProgressBar completed = { Math.floor(btmProSize) } bgColor = "#345C70" customLabel=' ' height='3px'/> }
          </>
          :
          <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
    )
  }


 
export default QuizCard
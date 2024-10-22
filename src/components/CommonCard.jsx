import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import Performance from '../pages/personal/performance/Performance';
import GuessCard from './GuessCard';
import { ArrowBackIos as ArrowBack, ArrowForwardIos as ArrowFwd } from '@mui/icons-material';
import Spinner from 'react-spinner-material';
import randomGen from '../utils/randomGen';
import './CommonCard.css';
import shuffledNumbers from '../utils/shuffleArray';
import axios from 'axios';

import { useSelector } from 'react-redux'

let allocatedTime = 0; //seconds
let correctAnswers = 0;
let interval = null;

const enteringAudio = new Audio('/sounds/woosh.wav')
const tickAudio = new Audio('/sounds/tick-tock.wav')
tickAudio.volume = 0.02
enteringAudio.volume = 0.05

const CommonCard = () => {

    const { format, quizType, quizLength, order } = useSelector(state => state.quiz)
    const { _id: deckId, deckName, words: deck, performance } = useSelector(state => state.deck.openDeck)
    const [card, setCard] = useState(deck[order[0]]);
    const [correctOption, setCorrectOption] = useState(null);
    const [selectedItem, setSelectedItem] = useState({});
    const [optionArray, setOptionArray] = useState([]);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(format);
    const [timePerCard, setTimePerCard] = useState(12);
    const [batchSize, setBatchSize] = useState(deck.length ? (deck.length > 30 ? 30 : deck.length) : 0)

    const [cardMotion, setCardMotion] = useState('card-entering-left');

    useEffect(() => {
      // enteringAudio.currentTime = .2
      enteringAudio.play()
    }, [])

    const changeCard = (direction) => {
      let timerId;
      const delay = 700
      if (direction === '>') {
        setCardMotion('card-exiting-right');
        setTopProSize(0)
        timerId = setTimeout(() => {
          // enteringAudio.currentTime = 0.2
          enteringAudio.play()
          setCardMotion('card-entering-left');
        }, delay);
      } else {
        setCardMotion('card-exiting-left');
        timerId = setTimeout(() => {
          setCardMotion('card-entering-right');
        }, delay);
      }
      return () => clearTimeout(timerId);
    };
    
    useEffect(() => {
       if (deck) {
          setCard(deck[order[0]]);
          let d = deck.performance?.correct
          if (!d || d.length === 0) return;
          d = d.filter((i) => i !== null) // bc 0 may not come
          const count = Math.min(d.length, 3);
          const lastNumbers = d.slice(-count)
          const sum = lastNumbers.reduce((total, num) => total + num, 0);
          const average = (sum / count)/10; // 0 - 10
          const result = 10 * Math.exp(-0.1 * Math.log(10/3) * average); // max = 10, min = 3
          setTimePerCard(result);
          return
       }
    }
    , [deck])
    
    useEffect(() => {
        if (!card) return
        const AlreadyPicked = deck.indexOf(card)
        const handleRandomize = async (max, howMany, alreadyUsed) => {
          try {
            const result = await randomGen(max, howMany, alreadyUsed); 
            return result;
          } catch (error) {
            console.error('Error in randomizer:', error);
          }
        };

        if (format.content.type === 'mcq') {
          setCardFormat(prev => 
            ({...prev, 
                  label0 : quizLength === 'short' ? (quizType === "example" ? 'Pick the right word/expression to fill in the blanks below' : (quizType === 'meaning' ? "What's the word for:" :`What is the ${quizType} of: `)) : (quizType === 'example'? 'Use the following word in the appropriate blanks': `What's the ${quizType} of`), //(quizType === 'example' ? blankedWordFinder(card.example, card['blanked example']) : card.word),
                  label1 : quizLength === 'short' ? (quizType === 'example'? card['blanked example']: card[quizType]) : (quizType === 'example'? blankedWordFinder(card.example, card['blanked example']): card.word)
            })
          );
          const corrOpt = (quizLength === 'long' || quizType === 'example') ? card[quizType] : card.word
          console.log(corrOpt)
          setCorrectOption(corrOpt)
          handleRandomize(deck.length, deck.length >= 4 ? 3 : deck.length-1, AlreadyPicked)
          .then(dataArrHere => 
            { console.log('94', dataArrHere)
              setOptionArray(() => 
                shuffledNumbers([...new Set([...dataArrHere, AlreadyPicked])])
                .map(cardIndexHere => {
                    console.log('95', deck[cardIndexHere])
                    return deck[cardIndexHere] //quizLength === 'long' ? {...variation, example : variation.example.toLowerCase().replace(variation.wordReferenceInExample.toLowerCase(), '____') } : variation
                })  
            )}
          )
        }
        
        else if (format.content.type === 'guess') {
          setCardFormat(prev => 
            ({
              ...prev, 
              question : quizLength === 'short' ? (quizType === "example" ? card['blanked example'] : card[quizType]) : card.word,
              answer : quizLength === 'short' ? (quizType === "example" ? card.example : card.word) : card[quizType],
            })
          )
        }

      }, 
    [card])


    useEffect(() => {
      if (!deck || cardMotion !== 'card-entering-left') return
      allocatedTime = 10 // the allocated time will depend on the constant and the length of the deck
      const stepTime = .5 // half a sec
      correctAnswers = 0;
      tickAudio.play()
      interval = setInterval(() => {
        setTopProSize(prev => {
          if (prev + (stepTime / allocatedTime) * 100 > 100) {
            handleItemClick({value: 'no selection because of timeout'}, true);  // true on automatic for toks, otherwise, false
            clearInterval(interval)
            return 100
          }
          return prev + (stepTime / allocatedTime) * 100
          }
        )
      }, stepTime * 1000);

      return () => clearInterval(interval)
    }, [deck, cardMotion])

    useEffect(() => {
      if (interval !== null && quizDone) {
        clearInterval(interval);
        interval = null;
      }
    }, [quizDone])

    useEffect(() => {
      if (btmProSize == 0) return
      let delayId
      setQuizDone(() => {
        if (btmProSize < 100) {
            delayId = setTimeout(() => {
              const nextCard = deck[order[Math.round(btmProSize * batchSize/100)]] // in case it doesn't have a synonym for ex
              console.log(nextCard, '..............')
              if (!nextCard[quizType]) return setBtmProSize(prev =>  Math.round((Math.round(prev*batchSize/100) + 1) * 100/batchSize) )
              setCard(deck[order[Math.round(btmProSize * batchSize/100)]]);
              changeCard('>')
              setSelectedItem({})
            }, 1500) //format.content.type === 'mcq' ? 1500: 0);
          return false
        } else {
          return true
        }
      })
      
      return () => clearTimeout(delayId)
    }, [btmProSize])

    // useEffect(()=> {
    //     if (!optionArray) return
    //     setCorrectOption(optionArray.indexOf(deck.indexOf(card)))
    // }, [optionArray])

    const handleItemClick = (item, correct) => {
            if (correct) correctAnswers += 1;
            setSelectedItem(item);
            tickAudio.pause()
            tickAudio.currentTime = 0
            // console.log(btmProSize, item)
            setBtmProSize(prev =>  Math.round((Math.round(prev*batchSize/100) + 1) * 100/batchSize) ) 
    };
    
    const blankedWordFinder = (example, blankedExample) => {
      const exHere = example.split(' ')
      // const blankedHere = blankedExample.split(' ')
      return exHere.filter(chunk => !blankedExample.includes(chunk)).join(' ')
    }

    const colors = (percentage) => {
      if (percentage < 50) return 'green'
      if (percentage < 65) return 'yellow'
      if (percentage <= 80) return 'orange'
      return 'red'
    }

    return (
         deck ?
          quizDone ? <Performance deckName={deckName} deckId={deckId} perf={performance} givenTime={allocatedTime} duration={ (topProSize * allocatedTime /100) + (batchSize - 1) * allocatedTime } correctAnswers={batchSize} all={batchSize} /> :
          <>
            { format.topProgressbar && <ProgressBar completed = {Math.floor(topProSize)} bgColor = {colors(topProSize)} customLabel=' ' height='2px' transitionDuration='.5s'/> }
            {format.content.type === 'mcq' ?
              <McqCard correctOption={correctOption} selectedItem={selectedItem} cardMotion={cardMotion} blankedWordFinder={blankedWordFinder} cardFormat={cardFormat} optionArray={optionArray} handleItemClick={handleItemClick} card={card} quizLength={quizLength} quizType={quizType}/>
              :
              <GuessCard cardMotion={cardMotion} cardFormat={cardFormat} btmProSize={btmProSize} handleItemClick={handleItemClick} topProSize={topProSize} quizLength={quizLength} quizType={quizType}/>
            }
            { format.btmProgressbar && <ProgressBar completed = { Math.floor(btmProSize) } bgColor = "#345C70" customLabel=' ' height='3px'/> }
          </>
          :
          <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
    )
  }

const McqCard = ({correctOption, selectedItem, cardMotion, blankedWordFinder, cardFormat, optionArray, handleItemClick, card, quizLength, quizType}) => (
  <div className={`common-card ${cardMotion}`}>
      <div className="common-head">
          <div className='label0'>{cardFormat.label0 }</div>
          <div className='label1'>{ cardFormat.label1 }</div>
          {/* { format.label2 && <div>{ format.label2 }</div> } */}
      </div>


    <div className="common-main"> 
      <div className="top">
        <div>{card.type}</div>
        <div>{card['language style']}</div>
      </div>

      <div className="middle">
        { optionArray && 
          optionArray.map(variation => quizLength === 'short' ? 
                                        (quizType !== 'example' ? {label: variation.word, value: variation.word} :
                                          {label: blankedWordFinder(variation.example, variation['blanked example']), value: variation.example}
                                        ) 
                                      :
                                        (
                                          quizType !== 'example' ? {label: variation[quizType], value: variation[quizType]} :
                                          {label: variation['blanked example'], value: variation.example}
                                        )
          ).map((item, indexHere) => {
          return  <div key={indexHere} style={{border: (selectedItem.value && correctOption === item.value) ? '2px solid white' : '', backgroundColor: (selectedItem.value && correctOption === item.value) ? 'green': (selectedItem.value === item.value ? 'red': '')}} 
                    onClick={() => {handleItemClick(item, item.value === correctOption)}}>{item.label}
                </div>
        })}
      </div>
    </div>

    <div className="common-foot">
      {/* { format.label3 && <div>{ format.label3 }</div> } */}
      {/* { format.label4 && <div>{ format.label4 }</div> } */}
    </div>
  </div>
)
 
export default CommonCard
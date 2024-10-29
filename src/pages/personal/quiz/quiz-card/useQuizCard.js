import { useState, useEffect } from "react";

import shuffledNumbers from '../../../../utils/shuffleArray';
import randomGen from '../../../../utils/randomGen'
import quizFormat from "../quiz-selector/quizFormat";

import cardFormatter from "./utils/cardFormatter";
import nextCard from "./utils/nextCard";

import { useSelector } from 'react-redux'

let allocatedTime = 0; //seconds
let correctAnswers = 0;
let interval = null;

const enteringAudio = new Audio('/sounds/woosh.wav')
const tickAudio = new Audio('/sounds/tick-tock.wav')
tickAudio.volume = 0.02
enteringAudio.volume = 0.05



const useQuizCard = (quizType, quizLength, order, deckLearnChunk, autoMode, formatRouter) => {
    const { _id: deckId, deckName, words: deck } = useSelector(state => state.deck.openDeck)
    const [card, setCard] = useState(deckLearnChunk[0]);
    const [correctOption, setCorrectOption] = useState(null);
    const [selectedItem, setSelectedItem] = useState({});
    const [optionArray, setOptionArray] = useState([]);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(null);
    const [timePerCard, setTimePerCard] = useState(12);
    const [format, setFormat] = useState(null)
    // const [batchSize, setBatchSize] = useState(deck.length ? (deck.length > 30 ? 30 : deck.length) : 0)

    const [cardMotion, setCardMotion] = useState('card-entering-left');

    useEffect(() => {
      enteringAudio.play()
      return () => enteringAudio.pause()
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
      (async() => {
        const level = Math.round(Math.random()*8)
        // console.log(card, card?.level?.level)
        const { quizType, route, quizLength } = formatRouter(level)
        console.log(quizType, route, quizLength)
        const formatted = await cardFormatter(deck, card, quizFormat(route), quizType, quizLength, blankedWordFinder)
        console.log(formatted, '........formatted', quizFormat(route))
        setFormat(quizFormat(route))
        setCardFormat(prev => ({...quizFormat(route), ...formatted}))
        setOptionArray(formatted.options)
        setCorrectOption(formatted.corrOpt)
      })()
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
      let delayId

      nextCard(setQuizDone, btmProSize, setBtmProSize, delayId, quizType, deckLearnChunk, setCard, changeCard, setSelectedItem)
      
      return () => clearTimeout(delayId)
    }, [btmProSize])

    const handleItemClick = (item, correct) => {
            if (correct) correctAnswers += 1;
            setSelectedItem(item);
            tickAudio.pause()
            tickAudio.currentTime = 0
            setBtmProSize(prev =>  Math.round((Math.round(prev*deckLearnChunk.length/100) + 1) * 100/deckLearnChunk.length) ) 
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

    return {
        correctOption, selectedItem, optionArray, quizDone, topProSize, btmProSize, cardFormat,
        timePerCard, cardMotion, deck, deckId, colors, handleItemClick, blankedWordFinder, card, format
    }
}


export default useQuizCard
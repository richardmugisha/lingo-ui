import { useState, useEffect } from "react";

import shuffledNumbers from '../../../../utils/shuffleArray';
import randomGen from '../../../../utils/randomGen'

import { useSelector } from 'react-redux'

let allocatedTime = 0; //seconds
let correctAnswers = 0;
let interval = null;

const enteringAudio = new Audio('/sounds/woosh.wav')
const tickAudio = new Audio('/sounds/tick-tock.wav')
tickAudio.volume = 0.02
enteringAudio.volume = 0.05



const useQuizCard = (format, quizType, quizLength, order) => {
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

    return {
        correctOption, 
        selectedItem,
        optionArray,
        quizDone,
        topProSize,
        btmProSize,
        cardFormat,
        timePerCard,
        batchSize,
        cardMotion,
        deck,
        deckId,
        colors,
        handleItemClick,
        blankedWordFinder,
        card
    }
}


export default useQuizCard
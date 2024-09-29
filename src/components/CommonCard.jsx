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
    const [timePerCard, setTimePerCard] = useState(5);
    
    const allowApi = useRef(true)

    // const getMetadata = async () => {
    //   const API_BASE_URL = API_BASE_URL
    //   try {
    //     const response =  await axios.get(`${API_BASE_URL}/cards/deck/${ deckId }`);
    //     const data = response.data.deck;
    //     return data?.performance?.correct; // i will use correct b/c it is 0-100
    //   } catch (error) {
    //      return
    //   }
    // }

    // useEffect(() => {
    //   (allowApi.current) && ( async () => {
    //     allowApi.current = false;
    //     let d = await getMetadata()
    //     if (!d || d.length === 0) return;
    //     d = d.filter((i) => i !== null) // bc 0 may not come
    //     const count = Math.min(d.length, 3);
    //     const lastNumbers = d.slice(-count)
    //     const sum = lastNumbers.reduce((total, num) => total + num, 0);
    //     const average = (sum / count)/10; // 0 - 10
    //     const result = 10 * Math.exp(-0.1 * Math.log(10/3) * average); // max = 10, min = 3
    //     setTimePerCard(result);
    //     return
    //   })()
      
    // }, [])

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
                  label0 : quizLength === 'short' ? (quizType !== "example" ? card[quizType] : card['blanked example']) : (quizType === 'example' ? blankedWordFinder(card.example, card['blanked example']) : card.word),
                  label1 : quizLength === 'short' ? (quizType === 'example'? 'fill in the blanks': `is the ${quizType} of :`) : (quizType === 'example'? 'Use this to fill in the appropriated blanks': `What is the ${quizType} of the word above:`)
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
      if (!deck) return
      allocatedTime = timePerCard * deck.length // the allocated time will depend on the constant and the length of the deck
      correctAnswers = 0;
      interval = setInterval(() => {
        setTopProSize(prev => { if (prev + timePerCard*100/allocatedTime < 100) return prev + timePerCard*100/allocatedTime
                                    setQuizDone(true)
                                    return prev;
                              }
                      );
      }, timePerCard*1000);

      return () => clearInterval(interval)
    }, [deck, timePerCard])

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
              setCard(deck[order[Math.round(btmProSize * deck.length/100)]]);
              setSelectedItem({})
            }, format.content.type === 'mcq' ? 1000: 0);
          return false
        } else {
          console.log(btmProSize)
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
            console.log(btmProSize, item)
            setBtmProSize(prev =>  Math.round((Math.round(prev*deck.length/100) + 1) * 100/deck.length) ) 
    };
    
    const blankedWordFinder = (example, blankedExample) => {
      const exHere = example.split(' ')
      // const blankedHere = blankedExample.split(' ')
      return exHere.filter(chunk => !blankedExample.includes(chunk)).join(' ')
    }

    return (
        <>
          { deck ?
          quizDone ? <Performance deckName={deckName} deckId={deckId} perf={performance} givenTime={allocatedTime} duration={ topProSize * allocatedTime /100 } correctAnswers={correctAnswers} all={deck.length} /> :
          
          format.content.type === 'mcq' ?
          <div className='common-card'>
              <div className="common-head">
                  <div className='label0'>{cardFormat.label0 }</div>
                  { format.topProgressbar && <ProgressBar completed = {Math.floor(topProSize)} bgColor = "black" /> }
                  <div className='label1'>{ cardFormat.label1 }</div>
                  { format.label2 && <div>{ format.label2 }</div> }
              </div>


            <div className="common-main"> 
              <div className="top">
                {/* {!['guess', 'mcq'].includes(format.content.type) && card.type && <div>{card.type}</div>} */}
                {/* {!['guess', 'mcq'].includes(format.content.type) && card.type && <div>{card.type}</div>} */}
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
                  return  <div key={indexHere} style={{backgroundColor: (selectedItem.value && correctOption === item.value) ? 'green': (selectedItem.value === item.value ? 'red': '')}} 
                            onClick={() => {handleItemClick(item, item.value === correctOption)}}>{item.label}
                        </div>
                })}
              </div>
            </div>

            <div className="common-foot">
              { format.label3 && <div>{ format.label3 }</div> }
              { format.btmProgressbar && <ProgressBar completed = { Math.floor(btmProSize) } bgColor = "black" /> }
              { format.label4 && <div>{ format.label4 }</div> }
            </div>
          </div>:
          <GuessCard cardFormat={cardFormat} btmProSize={btmProSize} handleItemClick={handleItemClick} topProSize={topProSize} quizLength={quizLength} quizType={quizType}/>
          :<div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
        }
        </>
        )
      }

 
export default CommonCard
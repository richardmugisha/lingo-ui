import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import Performance from '../pages/personal/performance/Performance';
import GuessCard from './GuessCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Spinner from 'react-spinner-material';
import randomGen from '../utils/randomGen';
import './CommonCard.css';
import shuffledNumbers from '../utils/shuffleArray';
import axios from 'axios';

var cardIndex = 0;
let duration = 0;
let allocatedTime = 0; //seconds
let correctAnswers = 0;
let interval = null;

const CommonCard = ({deckName, format, deck, quizType, quizLength, order}) => {
    const [card, setCard] = useState(deck[order[cardIndex]]);
    const [correctOption, setCorrectOption] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [optionArray, setOptionArray] = useState(false);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(format);
    const [timePerCard, setTimePerCard] = useState(5);
    
    const allowApi = useRef(true)

    const getMetadata = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      try {
        const response =  await axios.get(`${baseUrl}/api/v1/cards/deckMetadata/${ deckName }`);
        const data = response.data.deckMetadata;
        return data?.performance?.correct; // i will use correct b/c it is 0-100
      } catch (error) {
         return
      }
    }

    useEffect(() => {
      (allowApi.current) && ( async () => {
        allowApi.current = false;
        let d = await getMetadata()
        if (!d || d.length === 0) return;
        d = d.filter((i) => i !== null) // bc 0 may not come
        const count = Math.min(d.length, 3);
        const lastNumbers = d.slice(-count)
        const sum = lastNumbers.reduce((total, num) => total + num, 0);
        const average = (sum / count)/10; // 0 - 10
        const result = 10 * Math.exp(-0.1 * Math.log(10/3) * average); // max = 10, min = 3
        setTimePerCard(result);
        return
      })()
      
    }, [])

    useEffect(() => setCard(deck[order[cardIndex]]), [deck])
    
    useEffect(() => {
        if (!card) return
        const AlreadyPicked = deck.indexOf(card)
        const handleRandomize = async (max, howMany, alreadyUsed) => {
          try {
            const result = await randomGen(max, howMany, alreadyUsed); 
            return [...result];
          } catch (error) {
            console.error('Error in randomizer:', error);
          }
        };

        if (format.content.type === 'mcq') {
          handleRandomize(card.variations.length, 1, '')
            .then(dataArr => {
              setCardFormat(prev => 
                ({...prev, 
                  label0 : quizLength === 'short' ? (quizType !== "example" ? card.variations[dataArr[0]][quizType] : card.variations[dataArr[0]][quizType].replace(card.variations[dataArr[0]].wordReferenceInExample, '____')) : card.variations[dataArr[0]].variationWord,
                  label1 : quizLength === 'short' ? (quizType === 'example'? 'fill in the blanks': `is the ${quizType} of :`) : (quizType === 'example'? 'Fill in the blanks with this': `What is the ${quizType} of:`)
                })
              );
              setCorrectOption(quizLength === 'short' ? card.variations[dataArr[0]].variationWord : quizType !== 'example' ? card.variations[dataArr[0]][quizType] : card.variations[dataArr[0]][quizType].toLowerCase().replace(card.variations[dataArr[0]].wordReferenceInExample.toLowerCase(), '____') )
              handleRandomize(deck.length, deck.length >= 4 ? 3 : deck.length-1, AlreadyPicked)
              .then(dataArrHere => 
                setOptionArray(() => 
                  shuffledNumbers([...dataArrHere, AlreadyPicked])
                        .map(cardIndexHere => {
                          const variation = deck[cardIndexHere].variations.find(variation => variation.variationType === card.variations[dataArr[0]].variationType) || deck[cardIndexHere].variations[0]
                          return quizLength === 'long' ? {...variation, example : variation.example.toLowerCase().replace(variation.wordReferenceInExample.toLowerCase(), '____') } : variation
                        })  
                )
              )
            })
          }
        
        else if (format.content.type === 'guess') {
          handleRandomize(card.variations.length, 1, '')
          .then(dataArr => 
            setCardFormat(prev => 
              ({
              ...prev, 
              question : quizLength === 'short' ? (quizType !== "example" ? card.variations[dataArr[0]][quizType] : card.variations[dataArr[0]][quizType].replace(card.variations[dataArr[0]].wordReferenceInExample, '____')) : card.variations[dataArr[0]].variationWord,
              answer : quizLength === 'short' ? card.variations[dataArr[0]].variationWord : card.variations[dataArr[0]][quizType],
              })
            )
          )
        }

      }, [card, deck])


    useEffect(() => {
      if (!deck) return
      cardIndex = 0;
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
              setSelectedItem(null)
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
            setBtmProSize(prev =>  Math.round((Math.round(prev*deck.length/100) + 1) * 100/deck.length) ) 
    };
    
    return (
        <>
          { deck ?
          quizDone ? <Performance deckName={deckName} givenTime={allocatedTime} duration={ topProSize * allocatedTime /100 } correctAnswers={correctAnswers} all={deck.length} /> :
          
          format.content.type === 'mcq' ?
          <div className='common-card'>
              <div className="common-head">
                  <div>{cardFormat.label0 }</div>
                  { format.topProgressbar && <ProgressBar completed = {Math.floor(topProSize)} bgColor = "black" /> }
                  <div>{ cardFormat.label1 }</div>
                  { format.label2 && <div>{ format.label2 }</div> }
              </div>


            <div className="common-main"> 
              <div className="top">
                {!['guess', 'mcq'].includes(format.content.type) && card.word && <div>{card.word}</div>}
                {!['guess', 'mcq'].includes(format.content.type) && card.type && <div>{card.type}</div>}
              </div>

              <div className="middle">
                { format.content.type === 'guess' && <i className="arrow"><FiChevronLeft /></i>}
              { format.content && <div className="content">{ optionArray && optionArray.map(variation => quizLength === 'short' ? (quizType === 'example' ? variation.wordReferenceInExample : variation.variationWord) : variation[quizType]
              ).map((item, indexHere) => {
                return  <div key={indexHere} style={{backgroundColor: selectedItem && correctOption === item ? 'green': (selectedItem === item) ? 'red': ''}} 
                            onClick={() => {handleItemClick(item, item === correctOption)}}>{item}
                        </div>
              })}</div>}
                { format.content.type === 'guess' && <i className="arrow"><FiChevronRight /></i>}
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
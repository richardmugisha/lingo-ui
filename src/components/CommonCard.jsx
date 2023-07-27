import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import Performance from '../pages/personal/Performance';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import randomGen from '../utils/randomGen';
import './CommonCard.css';
import shuffledNumbers from '../utils/shuffleArray';

var cardIndex = 0;
let duration = 0;
const timePerCard = 3
let allocatedTime = 0; //seconds
let stepPeriod = 3; // time interval of 3 seconds
let correctAnswers = 0;
let interval = null;

const CommonCard = ({format, deck, quizType, quizLength, order}) => {
    const [card, setCard] = useState(deck[order[cardIndex]]);
    const [correctPos, setCorrectPos] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [incorrectArray, setIncorrectArray] = useState(false);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(format)
    
    useEffect(() => {
        if (!card) return
        const AlreadyPicked = deck.indexOf(card)
        console.log(card)
        const handleRandomize = async (max, howMany, alreadyUsed) => {
          try {
            const result = await randomGen(max, howMany, alreadyUsed); // Example values for max, howMany, and alreadyUsed
            return [...result];
          } catch (error) {
            console.error('Error in randomizer:', error);
          }
        };

        if (format.content.type === 'mcq') {
          if (quizLength === 'short') {
            if (quizType === 'synonym' || quizType === 'antonym') {
              handleRandomize(card[quizType].length, 1, '').then(dataArr => setCardFormat((prev) => ({...prev, label0 : (card[quizType][dataArr[0]])})))
            }
            else{
              handleRandomize(card.meaning.length, 1, '').then(dataArr => setCardFormat((prev) => ({...prev, label0: (card.meaning[dataArr[0]][quizType]).toLowerCase().replace(card.word, '____')})))
            }
            //format.label0 = label0Content //quizType === 'synonym' || quizType === 'antonym'? label0Content : card.meaning[randomGen(card.meaning.length, 1, '')[0]][quizType];
            setCardFormat((prev) => ({...prev, label1 : quizType === 'example'? 'fill in the blanks': `is the ${quizType} of :`}))  //format.label1 = quizType === 'example'? 'fill in the blanks': `is the ${quizType} of :`
          }
          else if (quizLength === 'long') {
            format.label0 = quizType === 'example'? 'Fill in the blanks with this': `What is the ${quizType} of:`;
            format.label1 = card.word
          }
        }

        handleRandomize(deck.length, deck.length >= 4 ? 3 : deck.length-1, AlreadyPicked).then(dataArr => setIncorrectArray(shuffledNumbers([...dataArr, AlreadyPicked])))
        
      }, [card])


    useEffect(() => {
      cardIndex = 0;
      allocatedTime = timePerCard * deck.length // the allocated time will depend on the constant and the length of the deck
      correctAnswers = 0;
      interval = setInterval(() => {
        setTopProSize(prev => { if (prev + stepPeriod*100/allocatedTime < 100) return prev + stepPeriod*100/allocatedTime
                                    setQuizDone(true)
                                    return prev;
                              }
                      );
      }, stepPeriod*1000);

      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
      if (interval !== null && quizDone) {
        clearInterval(interval);
        interval = null;
      }
    }, [quizDone])

    useEffect(()=> {
        if (!incorrectArray) return
        setCorrectPos(incorrectArray.indexOf(deck.indexOf(card)))
    }, [incorrectArray])

    const handleItemClick = (item, itemIndex) => {
            if (correctPos === itemIndex) correctAnswers += 1;
            setSelectedItem(item);
            console.log(btmProSize)
            setBtmProSize(prev => {
              if ( prev + 100/deck.length >= 100 ) setQuizDone(true)
              return prev + 100/ deck.length }
            )
            setTimeout(() => {
              cardIndex += cardIndex < order.length - 1 ? 1 : 0 ; 
              setSelectedItem('')
              setCard(deck[order[cardIndex]]);
              setSelectedItem(null)
            }, 1000)
    };
    
    return (
        <>
          { quizDone ? <Performance givenTime={allocatedTime} duration={ topProSize * allocatedTime /100 } correctAnswers={correctAnswers} all={deck.length} /> :
          <div className='common-card'>

              <div className="common-head">
                  <div>{ cardFormat.label0 }</div>
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
              { format.content && <div className="content">{ incorrectArray && incorrectArray.map(index => { // incorrect is the array of 4 random cards in the deck
                if (quizLength === 'short') return deck[index].word;
                if (['synonym', 'antonym'].includes(quizType)) return deck[index][quizType][index%4] // synonym / antonym at this almost random location
                return deck[index]['meaning'][index%4][quizType].toLowerCase().replace(deck[index].word, '____')
              }).map((item, indexHere) => {
                return  <div style={{backgroundColor: selectedItem && correctPos === indexHere ? 'green': (selectedItem === item) ? 'red': ''}} 
                            onClick={() => {handleItemClick(item, indexHere)}}>{item}
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
          </div>
        }
        </>
        )
      }

 
export default CommonCard
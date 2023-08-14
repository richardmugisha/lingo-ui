import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import Performance from '../pages/personal/Performance';
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
    const [correctPos, setCorrectPos] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [incorrectArray, setIncorrectArray] = useState(false);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(format);
    const [timePerCard, setTimePerCard] = useState(5);
    
    const allowApi = useRef(true)

    const getMetadata = async () => {
      const baseUrl = 'http://localhost:3500';
      try {
        const response =  await axios.get(`${baseUrl}/api/v1/cards/deckMetadata/${ deckName }`);
        const data = response.data.deckMetadata;
        return data.performance.correct; // i will use correct b/c it is 0-100
      } catch (error) {
        return error
      }
    }

    useEffect(() => {
      (allowApi.current) && ( async () => {
        allowApi.current = false;
        let d = await getMetadata()
        if (d.length == 0) return;
        d = d.filter((i) => i !== null) // bc 0 may not come
        const count = Math.min(d.length, 3);
        const lastNumbers = d.slice(-count)
        const sum = lastNumbers.reduce((total, num) => total + num, 0);
        const average = (sum / count)/10; // 0 - 10
        console.log(lastNumbers, average)
        const result = 10 * Math.exp(-0.1 * Math.log(10/3) * average); // max = 10, min = 3
        console.log(result)
        setTimePerCard(result);
        return
      })()
      
    }, [])

    useEffect(() => 
      setCard(deck[order[cardIndex]]), 
      [deck])
    
    useEffect(() => {
        if (!card) return
        const AlreadyPicked = deck.indexOf(card)
        //console.log(card)
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
        
      }, [card, deck])


    useEffect(() => {
      //console.log(deck)
      if (!deck) return
      //console.log(deck, cardFormat, card)
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
        console.log('done')
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
            cardIndex += cardIndex < order.length - 1 ? 1 : 0 ; 
            //setSelectedItem('')
            setCard(deck[order[cardIndex]]);
            setSelectedItem(null)
          }, 1000);
          return false
        } else {
          console.log(btmProSize)
          return true
        }
      })
      
      return () => clearTimeout(delayId)
    }, [btmProSize])

    useEffect(()=> {
        if (!incorrectArray) return
        setCorrectPos(incorrectArray.indexOf(deck.indexOf(card)))
    }, [incorrectArray])

    const handleItemClick = (item, itemIndex) => {
            if (correctPos === itemIndex) correctAnswers += 1;
            setSelectedItem(item);
            setBtmProSize(prev => {
              if ( prev + 100/deck.length >= 100 ) return 100
              return prev + 100/ deck.length }
            )
    };
    
    return (
        <>
          { deck ?
          quizDone ? <Performance deckName={deckName} givenTime={allocatedTime} duration={ topProSize * allocatedTime /100 } correctAnswers={correctAnswers} all={deck.length} /> :
          
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
                return  <div key={indexHere} style={{backgroundColor: selectedItem && correctPos === indexHere ? 'green': (selectedItem === item) ? 'red': ''}} 
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
          :<div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
        }
        </>
        )
      }

 
export default CommonCard
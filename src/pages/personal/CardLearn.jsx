import React, { useState, useEffect } from 'react';
import './CardLearn.css';
import ProgressBar from "@ramonak/react-progress-bar";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Spinner from 'react-spinner-material';

const CardLearn = ( { deck} ) => {
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
      console.log(deck)
      const handleKeyPress = (event) => {
        if (event.key === 'ArrowLeft')
          setCardIndex((prev) => (prev > 0 ? prev - 1 : deck.length -1 ));
        else if (event.key === 'ArrowRight')
          setCardIndex((prev) => (prev < deck.length - 1 ? prev + 1 : 0));
      };
  
      document.addEventListener('keydown', handleKeyPress);
  
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [deck.length]); 

  return (
    <>
    { deck ?
    <div className="card-learn">
        <div className="card-learn--head">
            <div className='card-learn--deckname'>{deck[cardIndex].deckName}</div> 
            <br />
            <span className='card-learn--big'>{deck[cardIndex].word}</span> : <span>{deck[cardIndex].type}</span>
        </div>
        <br />

        <div className="card-learn--body">
          <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev-1 : deck.length-1)}><FiChevronLeft /></i>
          <div className='card-learn--content'>
              {deck[cardIndex].meaning.map((item, index) => 
                <div key={index}>
                  <div><span className='card-learn--big'>{index+1})</span> {item.meaning}</div>
                  <div>e.g: {item.example}</div>
                  <br />
                </div>
              )}
              <div>
                <span className='card-learn--big'>synonyms </span>= {deck[cardIndex].synonym.map((synonym) => <span>{synonym}, </span>)}
              </div>
              <div>
              <span className='card-learn--big'>antonyms </span>= {deck[cardIndex].antonym.map((antonym) => <span>{antonym}, </span>)}
              </div>
              <br />
          </div>
          <i className="arrow" onClick={() => setCardIndex((prev) => prev < deck.length - 1 ? prev + 1 : 0)}><FiChevronRight /></i>
        </div>
        <br />
        <div className='card-learn--info'>swipe left or right</div>
        <br />
        <ProgressBar completed = {Math.round((cardIndex + 1) * 100 / deck.length)} bgColor = "black" /> 
        
    </div>:<div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
      }

    </>
  )
}

export default CardLearn

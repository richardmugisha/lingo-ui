import React, { useState, useEffect } from 'react';
import './CardLearn.css';
import ProgressBar from "@ramonak/react-progress-bar";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Spinner from 'react-spinner-material';

const CardLearn = ( { deckName, deck} ) => {
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

    useEffect(() => console.log(deck[cardIndex]), [cardIndex])

  return (
    <>
    { deck ?
    <div className="card-learn">
        <div className="card-learn--head">
            <div className='card-learn--deckname'>{deckName}</div> 
            <br />
            <span className='card-learn--big'>{deck[cardIndex]['root word']}</span> {/*: <span>{deck[cardIndex].type}</span>*/}
        </div>
        <br />

        <div className="card-learn--body">
          <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev-1 : deck.length-1)}><FiChevronLeft /></i>
          <div className='card-learn--content'>
              {deck[cardIndex].variations.map((variation, index) => 
              <section key={index}>
                <div>
                  <div>
                    <span className='card-learn--big'>{index+1} </span><span>{variation.variationType}</span> : <span>{variation.variationWord}</span>
                    <div> - {variation['language style']}</div>
                  </div>
                  <div><span className=''>def: </span> {variation.meaning}</div>
                  <div>e.g: {variation.example}</div>
                  <br />
                </div>

                <div>
                  <span className=''>synonym </span> = <span>{variation.synonym}</span> 
                </div>

                <div>
                  <span className=''>antonym </span>= <span>{variation.antonym}</span> 
                </div>
                {index < deck[cardIndex].variations.length - 1 && <><br /><hr /><br/></>}
              </section>
              
              )}

              {/* <div>
                <span className='card-learn--big'>synonym </span>= {[deck[cardIndex].variations.synonym].map((synonym) => <span>{synonym}, </span>)}
              </div>
              <div>
              <span className='card-learn--big'>antonyms </span>= {[deck[cardIndex].variations.antonym].map((antonym) => <span>{antonym}, </span>)}
              </div> */}
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

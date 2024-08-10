import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from 'react-spinner-material';
import './CardAdd.css';

import { useSelector, useDispatch } from 'react-redux';
import { modalSelect } from '../../../features/system/systemSlice';

const CardAdd = () => {
  const dispatch = useDispatch()
  const { cards: deck } = useSelector(state => state.deck)
  const [cardIndex, setCardIndex] = useState(0);
  
  useEffect(() => {
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
  
  
  console.log(deck)
  // if (deck) console.log(deck[cardIndex].deckName)

  return (
    <>
    { deck ?
    <div className='card-add'>
      <div className="head">
        <div>{deck[cardIndex].deckName}</div>
        <div onClick={() => dispatch(modalSelect('card-add-manual'))}>manual add</div>
        <div onClick={() => dispatch(modalSelect('card-add-auto'))}>auto add</div>
      </div>
      <div className="main">
            <div className="top">
                <div>{deck[cardIndex].variations[0].variationWord}</div>
                <div>{deck[cardIndex].variations[0].variationType}</div>
            </div>
            <div className="middle">
                <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev-1 : deck.length-1)}><FiChevronLeft /></i>
                <div className="content">
                    <div>{deck[cardIndex].variations[0].meaning}</div>
                    <div>e.g: {deck[cardIndex].variations[0].example}</div>  
                </div>
                <i className="arrow" onClick={() => setCardIndex((prev) => prev < deck.length - 1 ? prev + 1 : 0)}><FiChevronRight /></i>
            </div>
            <div className="main--bottom">
                learn more
            </div>
      </div>
      <div className="card-add--bottom">
        <div>click on &lt; or &gt; to swipe left or right</div>
        <ProgressBar completed = {Math.round((cardIndex + 1) * 100 / deck.length)} bgColor = "black" /> 
      </div>
    </div> : <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
      }
    </>
  )
}

export default CardAdd

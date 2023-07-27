import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProgressBar from "@ramonak/react-progress-bar";
import './CardAdd.css';

const CardAdd = ({deck, setModal, setModalSelect}) => {
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
  
  return (
    <div className='card-add'>
      <div className="head">
        <div>{deck[cardIndex].deckName}</div>
        <div onClick={() => setModalSelect('card-add-manual')}>manual add</div>
        <div onClick={() => setModalSelect('card-add-auto')}>auto add</div>
      </div>
      <div className="main">
            <div className="top">
                <div>{deck[cardIndex].word}</div>
                <div>{deck[cardIndex].type}</div>
            </div>
            <div className="middle">
                <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev-1 : deck.length-1)}><FiChevronLeft /></i>
                <div className="content">
                  <div>{deck[cardIndex].meaning[0].meaning}</div>
                  <div>e.g: {deck[cardIndex].meaning[0].example}</div>
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
    </div>
  )
}

export default CardAdd

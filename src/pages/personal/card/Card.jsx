import React, { useEffect } from 'react';
import './Card.css';

import { useNavigate } from 'react-router-dom';

const Card = ({ setModalSelect, deckId}) => {
  const navigate = useNavigate();
  const sendOut = (to) => {navigate(to)}
  
  return (
    <div className='card'>
        <div className='custom-button-1' onClick={() => setModalSelect('card-add')}>Add to the deck</div>
        <div className='custom-button-1' onClick={() => setModalSelect('card-learn')}>Practice the deck</div>
        <div className='custom-button-1' onClick={() => setModalSelect('card-quiz')}>Quiz yourself</div>
        <div className='custom-button-1' onClick={() => sendOut(`../more/story-time`)}>Story Time</div>
        <div className='custom-button-1' onClick={() => sendOut(`../more/temporary/deckId/${deckId}`)}>Copy cards from Temporary deck</div>
    </div>
  )
}

export default Card

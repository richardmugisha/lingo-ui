import React, { useEffect } from 'react';
import './Card.css';

import { useNavigate } from 'react-router-dom';

const Card = ({ setModal, setModalSelect, deckId, deck}) => {
  const navigate = useNavigate();
  const sendOut = (to) => {localStorage.setItem('deck', JSON.stringify(deck)); navigate(to)}
  
  return (
    <div className='card'>
        <div onClick={() => setModalSelect('card-add')}>Add to the deck</div>
        <div onClick={() => setModalSelect('card-quiz')}>Quiz yourself</div>
        <div onClick={() => setModalSelect('card-learn')}>Practice the deck</div>
        <div onClick={() => sendOut(`../more/story-time`)}>Story Time</div>
        <div onClick={() => sendOut(`../more/temporary/deckId/${deckId}`)}>Copy cards from Temporary deck</div>
    </div>
  )
}

export default Card

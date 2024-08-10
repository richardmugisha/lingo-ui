import React, { useEffect } from 'react';
import './Card.css';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { modalSelect } from '../../../features/system/systemSlice';

const Card = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const sendOut = (to) => {navigate(to)}

  const { id: deckId } = useSelector(state => state.deck)
  
  return (
    <div className='card'>
        <div className='custom-button-1' onClick={() => dispatch(modalSelect('card-add'))}>Add to the deck</div>
        <div className='custom-button-1' onClick={() => dispatch(modalSelect('card-learn'))}>Practice the deck</div>
        <div className='custom-button-1' onClick={() => dispatch(modalSelect('card-quiz'))}>Quiz yourself</div>
        <div className='custom-button-1' onClick={() => sendOut(`../more/story-time`)}>Story Time</div>
        <div className='custom-button-1' onClick={() => sendOut(`../more/temporary/deckId/${deckId}`)}>Copy cards from Temporary deck</div>
    </div>
  )
}

export default Card

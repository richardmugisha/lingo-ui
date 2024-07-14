import React from 'react';
import './Card.css';

import { useNavigate } from 'react-router-dom';

const Card = ({ setModal, setModalSelect, deckId}) => {
  const navigate = useNavigate();
  const sendToTemporary = () => navigate(`../more/temporary/deckId/${deckId}`)
  return (
    <div className='card'>
        <div onClick={() => setModalSelect('card-add')}>Add</div>
        <div onClick={() => setModalSelect('card-quiz')}>Quiz</div>
        <div onClick={() => setModalSelect('card-learn')}>Learn</div>
        <div onClick={sendToTemporary}>Copy from Temporary</div>
    </div>
  )
}

export default Card

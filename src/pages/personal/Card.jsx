import React from 'react';
import './Card.css';

const Card = ({ setModal, setModalSelect}) => {
  return (
    <div className='card'>
        <div onClick={() => setModalSelect('card-add')}>Add</div>
        <div onClick={() => setModalSelect('card-quiz')}>Quiz</div>
        <div onClick={() => setModalSelect('card-learn')}>Learn</div>
    </div>
  )
}

export default Card

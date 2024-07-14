import React, { useState } from 'react';
import './NewDeck.css'
import { useNavigate } from 'react-router-dom';

const NewDeck = ( { setDeckName, setDeckList, setModal, setModalSelect }) => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const sendToTemporary = () => navigate(`../more/temporary/deckName/${value}`)

  
  return (
    <div className='new-deck-page'>
      <div className='prompt'>creative deck name</div>
      <div className='text'>
        <input type="text" autoFocus value={value} onChange={(e) => {setValue(e.target.value); setDeckName(e.target.value)}}/>
      </div>
      <div className="buttons">
        <div className="manual" onClick={() => setModalSelect('card-add-manual')}>Create manually</div>
        <div className="auto-gen" onClick={() =>  setModalSelect('card-add-auto')}>generate with AI</div>
        <div onClick={sendToTemporary}>Copy from Temporary</div>
      </div>
    </div>
  )
}

export default NewDeck

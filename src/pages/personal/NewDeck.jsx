import React, { useRef } from 'react';
import './NewDeck.css'

const NewDeck = ( { setDeckName, setDeckList, setModal, setModalSelect }) => {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    const text = inputRef.current.value
    setDeckList((prev) => [...prev, text])
    setDeckName(text)
  }

  return (
    <div className='new-deck-page'>
      <div className='prompt'>creative deck name</div>
      <div className='text'>
        <input type="text" autoFocus ref={inputRef} />
      </div>
      <div className="buttons">
        <div className="manual" onClick={() => { handleSubmit(); setModalSelect('card-add-manual')}}>manual</div>
        <div className="auto-gen" onClick={() => { handleSubmit(); setModalSelect('card-add-auto')}}>auto-gen</div>
      </div>
    </div>
  )
}

export default NewDeck

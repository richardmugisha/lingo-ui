import React, { useEffect, useState } from 'react';
import './NewDeck.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { name, deckLang } from '../../../features/personal/deck/deckSlice';
import { modalSelect } from '../../../features/system/systemSlice';

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'spanish', label: 'spanish'}]

const NewDeck = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const navigate = useNavigate()

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    dispatch(deckLang(selectedOption.value))
  };

  useEffect(() =>
    { 
      dispatch(deckLang(selectedLanguage.value))
    }, 
    [selectedLanguage])


  const showAlert = () => {
    document.getElementsByClassName('deck--alert')[0].classList.remove('deck--hide')
    const timerId = setTimeout(() => {
      document.getElementsByClassName('deck--alert')[0].classList.add('deck--hide')
    }, 3000);
    return () => clearTimeout(timerId)
  }
  const handle = (from) => {
    return !value ? showAlert() : 
            from === 'add-manual' ? dispatch(modalSelect('card-add-manual')) : 
            from === 'add-auto' ?  dispatch(modalSelect('card-add-auto')) :
            navigate(`../more/temporary`)
  }
  
  return (
    <div className='new-deck-page'>
      <h1>Find a creative deck name</h1>
      <input type="deck-name" placeholder='Deck name' autoFocus value={value} onChange={(e) => {setValue(e.target.value); dispatch(name(e.target.value))}}/>
      <div className='select-container'>
      <label htmlFor="deck language">Cards language</label>
      <Select className='select'
          id="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          options={languages}
          placeholder={languages[0].label}
          isClearable
          styles={customStyles} // Apply custom styles here
        />
        </div>
      <p className='deck--alert deck--hide'>Please provide a deck name !</p>
      
      <div className="custom-button-1" onClick={() => handle('add-manual')}>Create cards manually</div>
      <div className="custom-button-1" onClick={() =>  handle('add-auto')}>generate cards with AI</div>
      <div className='custom-button-1' onClick={() =>  handle('copy-temp')}>Copy cards from Temporary</div>
      
    </div>
  )
}

export default NewDeck

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: '30px',    // Set your desired height
    border: state.isFocused ? '2px solid #007BFF' : '1px solid #ced4da',
    boxShadow: state.isFocused ? null : null,
    '&:hover': {
      border: state.isFocused ? '2px solid #007BFF' : '1px solid #ced4da',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '30px',
  }),
};

import React, { useState } from 'react';
import Select from 'react-select';
import './Filters.css'

import { BsFilterLeft } from "react-icons/bs";

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'panish', label: 'spanish'}]


const Filters = () => { //{ onTypeChange, onLanguageChange, languages }
  const [cardType, setCardType] = useState('my-cards');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setCardType(selectedType);
    //onTypeChange(selectedType);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    //onLanguageChange(selectedOption);
  };

  return (
    <div className="filters-container">
      <div className='filter-btn'><BsFilterLeft /> Filters</div>
      <div className="filter">
        <label htmlFor="card type"></label>
        <select id="card-type" value={cardType} onChange={handleTypeChange} className='select'>
          <option value="my cards">My Cards</option>
          <option value="all cards">All Cards</option>
        </select>
      </div>
      <div className="filter">
        <label htmlFor="language"></label>
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
    </div>
  );
};

export default Filters;

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
  
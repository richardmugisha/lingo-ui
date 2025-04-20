import React, { useState } from 'react';
import "./Filters.css"
import { MuiCheckbox, MuiAutoComplete } from '../../components/MuiComponents';
import { Link } from 'react-router-dom';

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'spanish', label: 'spanish'}]

export const LanguageSelect = ({ selectedLanguage, setSelectedLanguage }) => <MuiAutoComplete label='Language' options={languages} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} nullOption={{label: '', value: ''}}/>

const Filters = ({ useFilters, myCardsOnly, selectedLanguage, setMyCardsOnly, setSelectedLanguage, page, words, topicChain }) => {

  return (
          <>
              {
                useFilters &&
                <>
                  <MuiCheckbox label={`My cards only`} checkedValue={myCardsOnly} 
                    callback={() => setMyCardsOnly(!myCardsOnly)}
                  />
                  <LanguageSelect selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
                </>
              }
              <Categories current={page} words={words} topicChain={topicChain} />
          </>
  )
};

export default Filters;

const Categories = ({ current, words, topicChain }) => {
  return (
    <div className='categories'>
      <Link to="../topics" className={current === "topics" ? "selected" : ""}>Topics</Link>
      {topicChain.length > 0 && <Link to="../words" className={current === "words" ? "selected": ""}>Words</Link>}
      { words?.length > 0 &&
        <>
          <Link to="../stories" className={current === "stories" ? "selected": ""}>Stories</Link>
          <Link to="../chats" className={current === "chats" ? "selected": ""}>Scripts</Link>
        </>
      }
      <Link to="../fyp" className={current === "fyp" ? "selected": ""}>For You</Link>
    </div>
  )
}

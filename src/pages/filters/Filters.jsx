import React, { useState } from 'react';
import "./Filters.css"
import { MuiCheckbox, MuiAutoComplete } from '../../components/MuiComponents';
import { Link } from 'react-router-dom';

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'spanish', label: 'spanish'}]

export const LanguageSelect = ({ selectedLanguage, setSelectedLanguage }) => <MuiAutoComplete label='Language' options={languages} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} nullOption={{label: '', value: ''}}/>

const Filters = ({ useFilters, myCardsOnly, selectedLanguage, setMyCardsOnly, setSelectedLanguage, page, words, topicChain, stories, scripts }) => {

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
              <Categories current={page} words={words} topicChain={topicChain} stories={stories} scripts={scripts} />
          </>
  )
};

export default Filters;

const Categories = ({ current, words, topicChain, stories, scripts }) => {
  return (
    <div className='categories'>
      {
        current !== "fyp" ?
        <>
          <Link to="../topics" className={current === "topics" ? "selected" : ""}>Topics</Link>
          {topicChain.length > 0 && <Link to="../words" className={current === "words" ? "selected": ""}>Words ({words.length})</Link>}
          
          <Link to={words.length ? "../stories" : ""} className={current === "stories" ? "selected": ""}>Stories ({stories})</Link>
          <Link to={words.length ? "../chats" : ""} className={current === "chats" ? "selected": ""}>Scripts ({scripts})</Link>
            
          <Link to="../my-learning" className={current === "my-learning" ? "selected": ""}>My Learning</Link>
        </> :
      <Link to="../">Explore</Link>
      }
     
      <Link to="../fyp" className={current === "fyp" ? "selected": ""}>For You</Link>
    </div>
  )
}

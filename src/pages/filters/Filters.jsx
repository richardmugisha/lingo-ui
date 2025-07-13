import React, { useState } from 'react';
import "./Filters.css"
import { MuiCheckbox, MuiAutoComplete } from '../../components/MuiComponents';
import { Menu, Clear as MenuCancel} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const languages = [{value: 'english', label: 'english'}, {value: 'french', label: 'french'} , {value: 'spanish', label: 'spanish'}]

export const LanguageSelect = ({ selectedLanguage, setSelectedLanguage }) => 
      <MuiAutoComplete label='Language' options={languages} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} nullOption={{label: '', value: ''}}/>

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
  const [menuShow, setMenuShow] = useState(true)

  return (
    <>
    {menuShow && <div className='categories'>
      {
        current !== "fyp" ?
        <>
          <Link to="../topics" className={current === "topics" ? "selected" : ""}>Topics</Link>
          {topicChain.length > 0 && <Link to="../words" className={current === "words" ? "selected": ""}>Words ({words.length})</Link>}
          
          <Link to="../../more/story-time">Stories ({stories})</Link>
          <Link to={words.length === 0 ? "../chats" : ""} className={current === "chats" ? "selected": ""}>Scripts ({scripts})</Link>
            
          <Link to="../my-learning" className={current === "my-learning" ? "selected": ""}>My Learning</Link>
        </> :
      <Link to="../">Explore</Link>
      }
     
      <Link to="../fyp" className={current === "fyp" ? "selected": ""}>For You</Link>
    </div>}
    <span onClick={() => setMenuShow(!menuShow)} className='categories-show'>
      { menuShow ? <MenuCancel /> :  <Menu /> }
    </span>
    </>
  )
}

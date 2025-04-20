import React, { useEffect, useState } from 'react';
import './CardAddAuto.css';

import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { Button, Chip } from "@mui/material"
import { Add as AddIcon, Clear as ClearIcon, Check as CheckIcon } from "@mui/icons-material"

import { useSearchWords } from './utils/useSearchWords';
import useExtensionWords from './utils/useExtensionWords';
import { fetchSuggestions } from '../../../../api/http';

const CardAddAuto = () => {
  const handleRefresh = usePageRefreshHandle()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const topicChain = searchParams.get("topics")
  
  const retrieveIds = () => {
      const topic = useSelector(state => state.topic)
      if (topic?.name) return topic
      if (handleRefresh()) return useSelector(state => state.topic.topic)
      const newTopic = localStorage.getItem('new-topic--to-create')
      if (!newTopic) return {}
      const { name, language } = JSON.parse(newTopic);
      return {_id: '', language, name}
  }

  const [topic] = useState(retrieveIds())
  // const {_id: topic?._id, topic?.language, name } =  topic

  const [ isExtensionOpen, extensionWords ] = useExtensionWords()

  const [searchValue, setSearchValue] = useState('')
  const [fetching, searchWords, status, setStatus] = useSearchWords(searchValue, topic?.language)
  const [extraWords, setExtraWords] = useState(JSON.parse(localStorage.getItem('temporary'))?.words || [])
  const [suggestedWords, setSuggestedWords] = useState([])

  const [searchingWord, setSearchingWord] = useState({word: '', context: ''})
  
  useEffect(() => {
    //console.log(topic?.name)
    if (!topic?.name) navigate('../new-topic')
  }, [topic])

  const handleDeleteExtraWord = (word) => {
    setExtraWords((prev) => {
      //console.log(prev)
      const updatedWords = prev.filter(extraWord => !(extraWord.word === word.word && extraWord.context === word.context));
      const isWordInSuggestedList = suggestedWords.find(sugg => sugg.word === word.word && sugg.context === word.context)
      //console.log(updatedWords)
      if (!isWordInSuggestedList) localStorage.setItem('temporary', JSON.stringify({ words: updatedWords })); // we don't want to do anything with the suggestedWords + no saving them
      //console.log(word, searchingWord)
      if (searchingWord?.word === word.word) { setSearchingWord({word: '', context: ''}); setSearchValue('') }
      return updatedWords;
    });
  };

  useEffect(() => {
    if (extensionWords.length) {
      setExtraWords(prev => {
        prev = prev.concat(extensionWords)
        localStorage.setItem('temporary', JSON.stringify({words: prev}))
        return prev
      }
      );
    }
  }, [extensionWords])

  useEffect(() => {
      if (topic.words.length >= 10 || extraWords?.length) return
      console.log(topicChain, topic.name, topic.words.map(wObj => ({word: wObj.word, context: wObj.example})))
      fetchSuggestions(topicChain, topic.name, 10 - topic.words.length, 'words', topic.words.map(wObj => ({word: wObj.word, context: wObj.example})))
        .then(suggestions => setExtraWords( prev => {
          // console.log(suggestions)
          prev = prev.concat(suggestions)
          setSuggestedWords(suggestions)
          // localStorage.setItem('temporary', JSON.stringify({words: prev}))
          return prev
        }))
  }, [topic.words])
  
  const handleSearch = (e) => {
    //console.log(searchValue); 
    e.preventDefault();
    fetching(searchValue); 
    setSearchingWord({word: searchValue, context: ''})
  }

  return (
    <form action="" className='card-add-auto' onSubmit={handleSearch}>
      <div className='card-add-auto--top'>
        <label htmlFor="topic name" className="name">{topic.name}</label>
      </div>
      <input type='text' className='card-auto-search' autoFocus placeholder="Search for the word you want" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />
      { status === 'loading' && <p>...{status}</p> }
      <SearchList setStatus={setStatus} handleDeleteExtraWord={handleDeleteExtraWord} searchingWord={searchingWord} setSearchingWord={setSearchingWord} searchWords={searchWords} searchValue={searchValue} topic={topic} status={status} />
      {
       ( status === 'idle' && extraWords?.length > 0) && 
        <div className='card-auto--extra-words'> 
          <label htmlFor="">Search these words from your reading: </label>
          <ul >
          {extraWords?.slice(0, 3).map((word, i) => 
                <AddWordCard 
                  key={i}
                  wordExists={true}
                  handleClick={() => { fetching(word.word); setSearchValue(word.word); setSearchingWord(word) }}
                  word={word.word}
                  context={word.context}
                  BtnComponent={<ClearIcon 
                      sx={{
                        color: '#bb0000',
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#ee0000',
                          transform: 'scale(1.5)'
                        },
                      }}
                      onClick = {() => handleDeleteExtraWord(word)}
                  />}
                /> 
          )}
          </ul>
        </div>
      }
      {
        !isExtensionOpen && <div className='extension-opening-prompt'>Activate the flashcard extension to access words from your internet reading</div>

      }
    </form>
  )
}

export default CardAddAuto

const SearchList = ({ setStatus, handleDeleteExtraWord, searchingWord, setSearchingWord, searchWords, searchValue, topic, status }) => {
  const fetch_Save = (word, whereTo, doWhat) => {
    let toAdd; let words;
    if (['load', 'load-save'].includes(doWhat)) {
      toAdd = JSON.parse(localStorage.getItem(whereTo));
      words = toAdd?.[topic?._id || topic?.name]?.words || []
      if (doWhat === 'load') return words
    }

    localStorage.setItem(whereTo, JSON.stringify({...toAdd, [topic?._id || topic?.name]: {id: topic?._id, language: topic?.language, words: [...words, word]}}));
    setAddedWords([...addedWords, word]);
    handleDeleteExtraWord(word)
    setStatus('idle')
  }

  // Limit the displayed words to a maximum of 10
  const limitedSearchWords = searchWords?.slice(0, 10);
  const [addedWords, setAddedWords] = useState([...fetch_Save('', 'toAdd', 'load'), ...fetch_Save('', 'toWish', 'load')]) //the indices

  return <>
      <ul className='card-auto--search-list'>
        { ['success', 'error'].includes(status) &&
          (
            limitedSearchWords?.map((word, i) => (
              <AddWordCard 
                key={word+i}
                wordExists={true}
                handleClick={() => !addedWords.some(addedWord => addedWord.word === word.word && addedWord.context === word.example) && fetch_Save({word: word.word, context: word.example}, 'toAdd', 'load-save')}
                word={word.word} 
                context={word.example} 
                BtnComponent={addedWords.some(addedWord => addedWord.word === word.word && addedWord.context === word.example) &&
                  <CheckIcon color='success'/>}
              />
            ))
          )
        }
      </ul>

      {
        (['success', 'error'].includes(status) && searchValue) &&
        <>
          <div className="item-not-found">
            {limitedSearchWords?.length ? "Can't find what you are looking for? Add it to the wishlist here" :`OOps!!! The word is not yet in our evolving dictionary. Add it to the wishlist here`}
          </div>
          <AddWordCard 
                // handleClick={() => !addedWords.includes('bibi') && fetch_Save('bibi', 'toAdd', 'load-save')}
                wordExists={false}
                word={searchingWord.word} 
                context={searchingWord.context}
                setSearchingWord = {setSearchingWord}
                BtnComponent={addedWords.some(word => word.word === searchingWord.word && word.context === searchingWord.context) ?
                  <CheckIcon color='success'/> :
                    <>
                      <ClearIcon 
                          sx={{
                            color: '#bb0000',
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#ee0000',
                              transform: 'scale(1.5)'
                            },
                          }}
                          onClick = {() => handleDeleteExtraWord(searchingWord)}
                      />
                      {searchingWord.context && 
                        <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
                          onClick={() => fetch_Save(searchingWord, 'toWish', 'load-save')} >
                        </Button>
                      }
                    </>
                }
          />
        </>
      }

  </>
}

const AddWordCard = ({wordExists, handleClick, word, context, setSearchingWord, BtnComponent}) => {
  return (
    <div className={`search-item  ${wordExists && 'clickable'}`}>
      <div className={`word-and-context`} onClick={handleClick}>
        <div className="word">{word}</div>
        <div className="context">
          {
            wordExists ? 
            <div>{context}</div>
            :
            <input className='card-wish-input' 
              type="text" placeholder='Provide context for the word here'
              value={context}
              onChange={e => setSearchingWord(prev => ({...prev, context: e.target.value}))}
            />
          }
        </div>
      </div>
      {BtnComponent}
    </div>
  )
}
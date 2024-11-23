import React, { useEffect, useState } from 'react';
import './CardAddAuto.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { Button, Chip } from "@mui/material"
import { Add as AddIcon, Clear as ClearIcon, Check as CheckIcon } from "@mui/icons-material"

import { useSearchWords } from './utils/useSearchWords';
import useExtensionWords from './utils/useExtensionWords';

const CardAddAuto = () => {
  const handleRefresh = usePageRefreshHandle()
  const navigate = useNavigate()
  
  const retrieveIds = () => {
      const openDeck = useSelector(state => state.deck.openDeck)
      if (openDeck?.deckName) return openDeck
      if (handleRefresh()) return useSelector(state => state.deck.openDeck)
      const newDeck = localStorage.getItem('new-deck--to-create')
      if (!newDeck) return {}
      const { deckName, deckLang } = JSON.parse(newDeck);
      return {_id: '', deckLang, deckName}
  }

  const [openDeck] = useState(retrieveIds())
  const {_id: deckId, deckLang, deckName } =  openDeck

  const [ isExtensionOpen, extensionWords ] = useExtensionWords()

  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, searchWords, loading] = useSearchWords(searchValue, deckLang)
  const [extraWords, setExtraWords] = useState(JSON.parse(localStorage.getItem('temporary'))?.words || [])
  
  useEffect(() => {
    console.log(openDeck?.deckName)
    if (!openDeck?.deckName) navigate('../new-deck')
  }, [openDeck])

  const handleDeleteExtraWord = (index) => {
    setExtraWords((prev) => {
      const updatedWords = [...prev];
      updatedWords.splice(index, 1);
      localStorage.setItem('temporary', JSON.stringify({ words: updatedWords }));
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
  

  return (
    <form action="" className='card-add-auto'>
      <div className='card-add-auto--top'>
        <label htmlFor="deck name" className="deckName">{deckName}</label>
      </div>
      <input type='text' className='card-auto-search' autoFocus placeholder="Search for the word you want" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
      <SearchList searchWords={searchWords} searchValue={searchValue} debouncedSearch={debouncedSearch} deckId={deckId} deckName={deckName} loading={loading} deckLang={deckLang}/>
      {
        extraWords?.length > 0 && 
        <div className='card-auto--extra-words'> 
          <label htmlFor="">Search these words from your reading: </label>
          <ul >
          {extraWords?.slice(0, 5).map((word, i) => 
                <Chip
                  className='extra-word'
                  key={word + i}
                  label={word}
                  clickable
                  color="secondary"
                  onDelete={() => handleDeleteExtraWord(i)}
                  deleteIcon={<ClearIcon />}
                  variant="outlined"
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

const SearchList = ({ searchWords, searchValue, deckId, deckName, deckLang, debouncedSearch, loading }) => {
  const fetch_Save = (word, whereTo, doWhat) => {
    let toAdd; let words;
    if (['load', 'load-save'].includes(doWhat)) {
      toAdd = JSON.parse(localStorage.getItem(whereTo));
      words = toAdd?.[deckId || deckName]?.words || []
      if (doWhat === 'load') return words
    }

    localStorage.setItem(whereTo, JSON.stringify({...toAdd, [deckId || deckName]: {deckId, deckLang, words: [...words, word]}}));
    setAddedWords([...addedWords, word])
  }

  // Limit the displayed words to a maximum of 10
  const limitedSearchWords = searchWords?.slice(0, 10);
  const [addedWords, setAddedWords] = useState([...fetch_Save('', 'toAdd', 'load'), ...fetch_Save('', 'toWish', 'load')]) //the indices

  return <>
      <ul className='card-auto--search-list'>
        {
          loading ?  
          <p>...loading</p>
          :
          (
            limitedSearchWords.map((word, i) => (
              <li key={word._id} className='search-item'>
                  <div>
                    { word.word }
                  </div>
                  {addedWords.includes(word.word) ?
                  <CheckIcon color='success'/> :
                  <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation onClick={() => fetch_Save(word.word, 'toAdd', 'load-save')}>Add to the deck</Button>
                }
              </li>
            ))
          )
        }
      </ul>

      {
        (!loading && debouncedSearch) &&
        <div className='search-item item-not-found'>
              {
                addedWords.includes(debouncedSearch) ?
                <CheckIcon color='success'/> :
                <>
                 {limitedSearchWords.length ? "Can't find what you are looking for?" :`OOps!!! The word is not yet in our evolving dictionary`}
                  <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation onClick={() => fetch_Save(debouncedSearch, 'toWish', 'load-save')} >Add it to the wish list</Button>
                </>
              }
        </div>
      }

  </>
}
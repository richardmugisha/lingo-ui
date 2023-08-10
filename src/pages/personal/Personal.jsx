import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { FiXCircle, FiTrash2, FiCheck, FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi';
//import { Checkbox } from 'primereact/checkbox';
import Spinner from 'react-spinner-material';
        
import Card from './Card';
import CardAdd from './CardAdd';
import CardAddManual from './CardAddManual';
import CardAddAuto from './CardAddAuto';
import NewDeck from './NewDeck';
import CardLearn from './CardLearn';
import './Personal.css';
import Quiz from './Quiz';
import QuizLongMcq from './QuizLongMcq';
import QuizLongGuess from './QuizLongGuess';
import QuizShortMcq from './QuizShortMcq';
import QuizShortGuess from './QuizShortGuess';
//import deck from  '../../data/dummy'

const Personal = () => {
      const [modal, setModal] = useState(true);
      const [modalSelect, setModalSelect] = useState('card');
      const [quizType, setQuizType] = useState('')
      const [deckList, setDeckList] = useState([])
      const [deckContent, setDeckContent] = useState('')
      const [deckName, setDeckName] = useState('')
      const [deleting, setDeleting] = useState(false);
      const [checked, setChecked] = useState(false);
      const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
      const [error, setError] = useState('')
    
      const [popup, setPopup] = useState('')
      const baseUrl = "https://flashcard-api-hy23.onrender.com";
      useEffect(() => {
        setModal(false);
        const getDeckList = async () => {
          try {
            const response = await axios.get(`${baseUrl}/api/v1/cards`);
            //await new Promise(resolve => setTimeout(resolve, 2000)); // adding delay to test low connection
            const data = await response.data;
            //console.log(data)
            //console.log(data.deckNamesList)
            //console.log(response.status)
            return data.deckNamesList
            
          } catch (error) {
            throw new Error(error.message === 'Network Error' ? 'Network Error!': 'Error. Try again!')//there is an error to be handled later
          }
        }
        
        getDeckList().then(data => setDeckList(data)).catch(e => setError(e.message))

      }, [])

      useEffect(() => {
        if (deleting) return setPersonalSelectedItem(deckList)
      }, [checked])

      const openDeck = async (deckname) => {
        setDeckContent('') //resetting the deck in case we clicked another deck
        if (deleting) return setPersonalSelectedItem(prev => [...prev, deckname]);
        setDeckName(deckname);
        setModal(true)
        try {
          const res = await axios.get(`${baseUrl}/api/v1/cards/${deckname}`);
          //await new Promise(resolve => setTimeout(resolve, 2000)); // checking low connection
          const data = await res.data.cards;
          return data;
        } catch (error) {
          setError(error.message === 'network error' ? 'Network error' : 'Oops! Try again!')
        }
      }
    
      const deletingDecks = async () => {
        const deletingSet = [...new Set(personalSelectedItem)]
        console.log(deletingSet, `${baseUrl}/api/v1/cards/${ deletingSet }`)
        try {
          const res = await axios.delete(`${baseUrl}/api/v1/cards/${ deletingSet }`);
          const data = await res.data;
          setDeckList(prev => prev.filter(item => !deletingSet.includes(item)))
          setPersonalSelectedItem([]);
          setDeleting(false);
          setPopup(data.msg)
          //console.log(data)
        } catch (error) {
          //console.log(error)
        }
      }
    
      useEffect(() => {
        if (!popup) return
        const timeout = setTimeout(() => {
          setPopup('')
        }, 2000);

        return () => clearTimeout(timeout)
      }, [popup])
      
      const deselectAndReset = () => {
        //console.log('mami')
        setPersonalSelectedItem([]);
        setDeleting(false);
      }

  return (
    <div className="personal">
      <>
        <div className="head">
            <div className="shelf">your card shelf</div>
            <div className="new-deck" onClick={() => {setModal(true); setModalSelect('new-deck')}}>new card deck</div>
        </div>
        { !error && deckList && deckList.length ? <>
          { personalSelectedItem.length > 0 && <span style={{cursor: "pointer"}}><input type='checkbox' checked={checked} onChange={ () => setChecked(prev => !prev)}/> select all</span>}
          <span onClick={() => {setDeleting(true); setPopup('Choose the decks')}} style={{ padding: "5px 10px", margin: "0 20px 20px", borderRadius: "20px", backgroundColor: '#f00b', cursor: 'pointer'}}><i><FiTrash2 /></i> delete decks</span>
          { personalSelectedItem.length > 0 && <span style={{cursor: 'pointer', background: "#7b0", borderRadius: "20px", padding: "5px 10px"}} onClick = {deletingDecks}>confirm <i><FiCheck /></i></span>}
          { personalSelectedItem.length > 0 && <span style={{cursor: 'pointer', background: "#7ba", margin: "0 20px 20px", borderRadius: "20px", padding: "5px 10px"}} onClick={deselectAndReset}>Deselect all</span> }
          { popup &&<div style={{position: "absolute", left: "40%", background: "yellowgreen", padding: "5px 30px"}}>{popup}</div>
          }
          </> : null
        }
        { error && <span>{error}</span>}
        {!error && <div className="body">
            {!deckList.length &&  <span><Spinner radius={120} color="#345C70" stroke={2} visible={true} /></span>}
            {deckList && deckList.map((item, index) => <div className='deck-card' style={{backgroundColor: deleting && personalSelectedItem.includes(item) ? '#2225': "#C0D7DA"}} onClick={() => openDeck(item).then((data) => setDeckContent(data))} key={index}>{item}</div>)}
        </div>}
        
      </>
      {modal && !error &&
      <div className="modal">
        <div className="inner-modal">
          <i className='cancel' onClick={() => {setModal(false); setModalSelect('card')}}><FiXCircle /></i>
          { modalSelect === 'card' && <Card setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add' && <CardAdd deck={deckContent} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-manual' && <CardAddManual setDeckList={setDeckList} deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-auto' && <CardAddAuto setDeckList={setDeckList} deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'new-deck' && <NewDeck setDeckName={setDeckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-learn' && <CardLearn deck={deckContent} /> }
          { modalSelect === 'quiz-long-mcq' && <QuizLongMcq deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-long-guess' && <QuizLongGuess deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-short-mcq' && <QuizShortMcq deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-short-guess' && <QuizShortGuess deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'card-quiz' && <Quiz setModalSelect={setModalSelect} setQuizType={setQuizType} deck={deckContent}/> }
        </div>
      </div>
      }
    </div>
  )
}

export default Personal

import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { FiXCircle, FiTrash2, FiCheck } from 'react-icons/fi';
import { MdOutlineCancel } from "react-icons/md";
import Spinner from 'react-spinner-material';
        
import Card from '../card/Card'
import CardAdd from '../card-add/CardAdd';
import CardAddManual from '../card-add-manual/CardAddManual';
import CardAddAuto from '../card-add-auto/CardAddAuto';
import NewDeck from '../new-deck/NewDeck';
import CardLearn from '../card-learn/CardLearn';
import './Personal.css';
import Quiz from '../quiz/Quiz'
import QuizLongMcq from '../quiz/QuizLongMcq';
import QuizLongGuess from '../quiz/QuizLongGuess';
import QuizShortMcq from '../quiz/QuizShortMcq';
import QuizShortGuess from '../quiz/QuizShortGuess';
//import deck from  '../../data/dummy'

import Filters from '../../filters/Filters';
import { useNavigate } from 'react-router-dom';

const Personal = () => {
      const [modal, setModal] = useState(true);
      const [modalSelect, setModalSelect] = useState('card');
      const [quizType, setQuizType] = useState('')
      const [deckList, setDeckList] = useState([])
      const [deckContent, setDeckContent] = useState('')
      const [deckName, setDeckName] = useState('')
      const [deckId, setDeckId] = useState('')
      const [deleting, setDeleting] = useState(false);
      const [checked, setChecked] = useState(false);
      const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
      const [searching, setSearching] = useState(true)
      const [error, setError] = useState('')
    
      const [popup, setPopup] = useState('')
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      useEffect(()=> {
        localStorage.removeItem('deckId')
      }, [modal])

      useEffect(() => {
        setModal(false);
        const getDeckList = async () => {
          try {
            const response = await axios.get(`${baseUrl}/api/v1/cards`);
            const data = await response.data;
            setSearching(false)
            return data
            
          } catch (error) {
            throw new Error(error.message === 'Network Error' ? 'Network Error!': 'Error. Try again!')//there is an error to be handled later
          }
        }
        
        getDeckList().then(data => setDeckList(data)).catch(e => setError(e.message))

      }, [])

      const openDeck = async (deck) => {
        const { _id:deckId, deckName } = deck;
        setDeckContent('') //resetting the deck in case we clicked another deck
        if (deleting) return setPersonalSelectedItem(prev => prev.includes(deckId) ? prev.filter(id => id !== deckId) : [...prev, deckId]);
        setDeckName(deckName);
        localStorage.setItem('deckId', deckId)
        setModal(true)
        try {
          const res = await axios.get(`${baseUrl}/api/v1/cards/${deckId}`);
          const data = await res.data.cards;
          return data;
        } catch (error) {
          setError(error.message === 'network error' ? 'Network error' : 'Oops! Try again!')
        }
      }

    
      const deletingDecks = async () => {
        if (personalSelectedItem.length === 0) {setDeleting(true); setPopup('Choose the decks'); return}
        const deletingSet = [...new Set(personalSelectedItem)]
        console.log(deletingSet, `${baseUrl}/api/v1/cards/deckMetaData/${ deletingSet }`)
        try {
          const res = await axios.delete(`${baseUrl}/api/v1/cards/deckMetaData/${ deletingSet }`);
          const data = await res.data;
          setDeckList(prev => prev.filter(deck => !deletingSet.includes(deck._id)))
          setPersonalSelectedItem([]);
          setDeleting(false);
          setPopup(data.msg)
          console.log(data)
        } catch (error) {
          console.log(error)
        }
      }
    
      useEffect(() => {
        if (!popup) return
        const timeout = setTimeout(() => {
          setPopup('')
        }, 2000);

        return () => clearTimeout(timeout)
      }, [popup])
      
      const navigate = useNavigate();
      const toTemporary = () => {
        console.log('inside')
        navigate('../more/temporary/no-type/no-id'); //check external/more for docs
      }

  return (
    <div className="personal">
      <>
        <div className="head">
            <div className="shelf">your card shelf</div>
            <div className="new-deck" onClick={() => {setModal(true); setModalSelect('new-deck')}}>new card deck</div>
        </div>
        { !error && deckList && deckList.length ? 
          <div className='personal-filters'>
            { !deleting && <Filters />}
            { personalSelectedItem.length > 0 && 
            <span style={{cursor: "pointer"}} onClick={ () => {setChecked(prev => !prev); setPersonalSelectedItem(prev => prev.length === deckList.length ? [] : deckList.map(({_id}) => _id) )}} >
              <input type='checkbox' checked={checked} onChange={() => 'nothing should happen'}/> {`${ checked?'un':''}`}select all
            </span>}
            <span onClick={() => deletingDecks()} style={deleting ? { padding: "5px 10px", margin: "0 20px 20px", borderRadius: "20px", backgroundColor: '#f00b', cursor: 'pointer'} : {cursor: 'pointer'}}><i><FiTrash2 /></i>{deleting ? 'delete decks' : ''}</span>
            { personalSelectedItem.length > 0 && <span style={{cursor: 'pointer', background: "#7b0", borderRadius: "20px", padding: "5px 10px"}} onClick = {() => {setDeleting(false); setPersonalSelectedItem([]); setChecked(false)}}>Abort <i><MdOutlineCancel /></i></span>}
            { popup &&<div style={{position: "absolute", left: "40%", background: "yellowgreen", padding: "5px 30px"}}>{popup}</div>
            }
          </div> : null
        }
        { error && <span>{error}</span>}
        {!error && <div className="body">
            {searching &&  <span><Spinner radius={120} color="#345C70" stroke={2} visible={true} /></span>}
            <div className='deck-card' onClick={toTemporary}>Temporary </div>
            {deckList && deckList.map((deck, index) => <div className='deck-card' style={{backgroundColor: deleting && personalSelectedItem.includes(deck._id) ? '#2225': "#C0D7DA"}} onClick={() => openDeck(deck).then((data) => {setDeckContent(data); setDeckId(deck._id)})} key={index}>{deck.deckName}</div>)}
        </div>}
        
      </>
      {modal && !error &&
      <div className="modal">
        <div className="inner-modal">
          <i className='cancel' onClick={() => {setModal(false); setModalSelect('card')}}><FiXCircle /></i>
          { modalSelect === 'card' && <Card deckId={deckId} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add' && <CardAdd deck={deckContent} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-manual' && <CardAddManual setDeckList={setDeckList} deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-auto' && <CardAddAuto setDeckList={setDeckList} deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'new-deck' && <NewDeck setDeckName={setDeckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-learn' && <CardLearn deckName={deckName} deck={deckContent} /> }
          { modalSelect === 'quiz-long-mcq' && <QuizLongMcq deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-long-guess' && <QuizLongGuess deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-short-mcq' && <QuizShortMcq deckName={deckName} deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'quiz-short-guess' && <QuizShortGuess deckName={deckName} deck={deckContent} quizType={quizType}/> }
          { modalSelect === 'card-quiz' && <Quiz setModalSelect={setModalSelect} setQuizType={setQuizType} deck={deckContent}/> }
        </div>
      </div>
      }
    </div>
  )
}

export default Personal

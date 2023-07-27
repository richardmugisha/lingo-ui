import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { FiXCircle, FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi'
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

      useEffect(() => {
        setModal(false);
        const getDeckList = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/v1/cards');
            const data = await response.data;
            console.log(data.deckNamesList)
            return data.deckNamesList
          } catch (error) {
            console.error(error);
          }
        }
        
        getDeckList().then(data => setDeckList(data))

      }, [])

      const openDeck = async (deckname) => {
        setDeckName(deckname);
        try {
          const res = await axios.get(`http://localhost:5000/api/v1/cards/${deckname}`);
          const data = await res.data.cards;
          console.log(data)
          setDeckContent(data)
        } catch (error) {
          console.error(error);
        }
      }
    
  
  return (
    <div className="personal">
      <>
      <div className="head">
            <div className="shelf">your card shelf</div>
            <div className="new-deck" onClick={() => {setModal(true); setModalSelect('new-deck')}}>new card deck</div>
        </div>
        <div className="body"  onClick={() => setModal(true)}>
            {deckList && deckList.map((item) => <div onClick={() => openDeck(item)} key={item}>{item}</div>)}
        </div>
        
      </>
      {modal &&
      <div className="modal">
        <div className="inner-modal">
          <i className='cancel' onClick={() => {setModal(false); setModalSelect('card')}}><FiXCircle /></i>
          { modalSelect === 'card' && <Card setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add' && <CardAdd deck={deckContent} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-manual' && <CardAddManual deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'card-add-auto' && <CardAddAuto deckName={deckName} setModal={setModal} setModalSelect={setModalSelect} /> }
          { modalSelect === 'new-deck' && <NewDeck setDeckName={setDeckName} setDeckList={setDeckList} setModal={setModal} setModalSelect={setModalSelect} /> }
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

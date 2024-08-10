import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { FiXCircle, FiTrash2 } from 'react-icons/fi';
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

import Filters from '../../filters/Filters';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { id, list, name, cards, deckLang as setLang, removeDecks } from '../../../features/personal/deck/deckSlice';
import { modalSelect, modalShow } from '../../../features/system/systemSlice';

const Personal = () => {
      const dispatch = useDispatch()
      const { modal, modalSelection } = useSelector((state) => state.system )
      const {  list: deckList } = useSelector((state) => state.deck)

      const [deleting, setDeleting] = useState(false);
      const [checked, setChecked] = useState(false);
      const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
      const [searching, setSearching] = useState(true)
      const [error, setError] = useState('')

      const [cardType, setCardType] = useState('mine');
      const [selectedLanguage, setSelectedLanguage] = useState({label: 'all', value: 'all'});
    
      const [popup, setPopup] = useState('')
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      useEffect(()=> {
        if(!modal) {
          //localStorage.removeItem('deckId');
          dispatch(id(null))
        } 
          
      }, [modal])

      useEffect(() => {error && console.log(error)}, [error])

      useEffect(() => {
        dispatch(modalShow(false));
        const getDeckList = async () => {
          try {
            const user = /*{ userId: user} = useSelector(state => state.auth.user) */ JSON.parse(localStorage.getItem('user')).userId
            const response = await axios.get(`${baseUrl}/api/v1/cards/decks/${cardType === 'mine' ? user : 'all'}/${selectedLanguage.value}`);
            const data = await response.data;
            setSearching(false)
            return data
            
          } catch (error) {
            console.log(error.message)
            throw new Error(error.message === 'Network Error' ? 'Network Error!': 'Error. Try again!')//there is an error to be handled later
          }
        }
        
        getDeckList().then(data => dispatch(list(data))).catch(e => setError(e.message))

      }, [cardType, selectedLanguage])

      const openDeck = async (deck) => {
        const { _id:deckId, deckName, deckLang: language } = deck;
        dispatch(cards('')) //resetting the deck in case we clicked another deck
        if (deleting) return setPersonalSelectedItem(prev => prev.includes(deckId) ? prev.filter(id => id !== deckId) : [...prev, deckId]);
        dispatch(name(deckName));
        dispatch(modalShow(true))
        dispatch(modalSelect('card'))
        try {
          console.log(deckId)
          const res = await axios.get(`${baseUrl}/api/v1/cards/${deckId}`);
          const data = await res.data.cards;
          dispatch(cards(data))
          dispatch(id(deckId))
          dispatch(setLang(language))
          return data;
        } catch (error) {
          console.log(error.message)
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
          dispatch(removeDecks(deletingSet))
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
        {/*&& deckList && deckList.length*/}
        <div className="head">
            <div className="shelf">your card shelf</div>
            <div className="new-deck" onClick={() => {dispatch(modalShow(true)); dispatch(modalSelect('new-deck'))}}>new card deck</div>
        </div>
        { error ?
          <span>{error}</span>
          :<>
            <div className='personal-filters'>
              { !deleting && <Filters cardType={cardType} selectedLanguage={selectedLanguage} setCardType={setCardType} setSelectedLanguage={setSelectedLanguage}/>}
                <span style={{cursor: "pointer", }}>
                  <label htmlFor="personal-checkbox" >
                    <input type='checkbox' id='personal-checkbox' checked={checked} onChange={ () => {setChecked(prev => !prev); setPersonalSelectedItem(checked ? [] : deckList.map(({_id}) => _id) )}}/>
                    {`${ checked ? 'Unselect all' : 'Select all'}`}
                  </label>
                </span>

              <span onClick={() => deletingDecks()} style={deleting ? { padding: "5px 10px", margin: "0 20px 20px", borderRadius: "20px", backgroundColor: '#f00b', cursor: 'pointer'} : {cursor: 'pointer'}}><i><FiTrash2 /></i>{deleting ? 'delete decks' : ''}</span>
              { deleting > 0 && <span style={{cursor: 'pointer', background: "#7b0", borderRadius: "20px", padding: "5px 10px"}} onClick = {() => {setDeleting(false); setPersonalSelectedItem([]); setChecked(false)}}>Abort <i><MdOutlineCancel /></i></span>}
              { popup &&<div style={{position: "absolute", left: "40%", background: "yellowgreen", padding: "5px 30px"}}>{popup}</div>
              }
            </div>

            <div className="body">
              {searching &&  <span><Spinner radius={120} color="#345C70" stroke={2} visible={true} /></span>}
              <div className='deck-card' onClick={toTemporary}>Temporary </div>
              {deckList && deckList.map((deck, index) => <div className='deck-card' style={{backgroundColor: deleting && personalSelectedItem.includes(deck._id) ? '#2225': "#C0D7DA"}} onClick={() => openDeck(deck)} key={index}>{deck.deckName}</div>)}
            </div>
          </>
          }
        
      </>
      {modal && !error &&
      <div className="modal">
        <div className="inner-modal">
          <i className='cancel' onClick={() => {dispatch(modalShow(false)); dispatch(modalSelect('card'))}}><FiXCircle /></i>
          { modalSelection === 'card' && <Card /> }
          { modalSelection === 'card-add' && <CardAdd /> }
          { modalSelection === 'card-add-manual' && <CardAddManual /> }
          { modalSelection === 'card-add-auto' && <CardAddAuto /> }
          { modalSelection === 'new-deck' && <NewDeck /> }
          { modalSelection === 'card-learn' && <CardLearn /> }
          { modalSelection === 'card-quiz' && <Quiz /> }
        </div>
      </div>
      }
    </div>
  )
}

export default Personal

import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import Card from '../card/Card';
import CardAdd from '../card-add/CardAdd';
import CardAddManual from '../card-add-manual/CardAddManual';
import CardAddAuto from '../card-add-auto/CardAddAuto';
import NewDeck from '../new-deck/NewDeck';
import CardLearn from '../card-learn/CardLearn';
import './Personal.css';
import Quiz from '../quiz/Quiz';
import Filters from '../../filters/Filters';
import { useSelector, useDispatch } from 'react-redux';
import { openDeck, deckList, removeDecks } from '../../../features/personal/deck/deckSlice';
import { Button } from '@mui/material';
import { Delete as DeleteIcon, FilterAlt as FilterIcon, Clear as Close } from '@mui/icons-material';
import { MuiCheckbox } from '../../../components/MuiComponents';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const Personal = () => {
  const dispatch = useDispatch();
  const { deckList: deck_list } = useSelector((state) => state.deck);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [checked, setChecked] = useState(false);
  const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState({ label: '', value: '' });
  const [popup, setPopup] = useState('');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const batchReqRef = useRef(0)

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const apiBatchRequest = useCallback( (requests) => {
      axios.post(baseUrl + '/api/v1/batch-request', { requests })
          .then(res => {
            const { toAdd, toWish } = res.data.successRequests;
            console.log(toAdd, toWish)
            if (toAdd) localStorage.removeItem('toAdd')
            if (toWish) localStorage.removeItem('toWish')
          }
          )
          .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    const toAdd = JSON.parse(localStorage.getItem('toAdd'))
    const toWish = JSON.parse(localStorage.getItem('toWish'))
    const requests = []
    if (toAdd) requests.push({ route: 'toAdd', body: Object.entries(toAdd).map(([k, v]) => ({deckId: v.deckId ? k : '', deckName: k, words: v.words, deckLang: v.deckLang, userId})) } )
    if (toWish) requests.push({route: 'toWish', body:  Object.entries(toWish).map(([k, v]) => ({deckId: v.deckId ? k : '', deckName: k, words: v.words, deckLang: v.deckLang, userId})) } )
  
    if (batchReqRef.current === 0 && requests.length) { apiBatchRequest(requests); batchReqRef.current = 1 }
    
  }, [])

  useEffect(() => {
    const getDeckList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/cards/decks/${myCardsOnly ? userId : 'all'}/${selectedLanguage.value || 'all'}`);
        const data = await response.data;
        setSearching(false);
        return data;
      } catch (error) {
        console.log(error.message);
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
    };

    getDeckList()
      .then((data) => dispatch(deckList(data)))
      .catch((e) => setError(e.message));
  }, [myCardsOnly, selectedLanguage]);

  const onDeckClickHandle = async (deck) => {
    const { _id: deckId } = deck;
    dispatch(openDeck({})); // Resetting the deck in case another deck is clicked
    setPersonalSelectedItem([]);
    navigate('card');

    try {
      const res = await axios.get(`${baseUrl}/api/v1/cards/deck/${deckId}`);
      const deck = res.data.deck;
      dispatch(openDeck(deck));
      return deck;
    } catch (error) {
      console.log(error.message);
      setError(error.message === 'network error' ? 'Network error' : 'Oops! Try again!');
    }
  };

  const deletingDecks = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/api/v1/cards/deck/${personalSelectedItem}`);
      const data = await res.data;
      dispatch(removeDecks(personalSelectedItem));
      setPersonalSelectedItem([]);
      setPopup(data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!popup) return;
    const timeout = setTimeout(() => {
      setPopup('');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [popup]);

  const navigate = useNavigate();

  const toTemporary = () => {
    navigate('../more/temporary/no-type/no-id');
  };

  return (
    <div className="personal">
      <>
        <div className="head">
          <div className="shelf">Your decks</div>
          <div className="new-deck" onClick={() => navigate('new-deck')}>New Card Deck</div>
        </div>

        {!personalSelectedItem.length ? (
          <div className="personal--filters">
            <span className="filter-btn"><FilterIcon /> Filters</span>
            <Filters myCardsOnly={myCardsOnly} selectedLanguage={selectedLanguage} setMyCardsOnly={setMyCardsOnly} setSelectedLanguage={setSelectedLanguage}
            />
          </div>
        ) : (
          <div className="personal--deleting-panel">
            <MuiCheckbox
              label={`${checked ? 'Unselect All' : 'Select All'}`} checkedValue={checked}
              callback={() => {
                setChecked(!checked);
                setPersonalSelectedItem(checked ? [] : deck_list.filter(deck => deck.creator === userId).map(deck => deck._id));
              }}
            />
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={deletingDecks}> Delete </Button>
          </div>
        )}

        {popup && (
          <div style={{ position: 'absolute', left: '40%', background: 'yellowgreen', padding: '5px 30px' }}>{popup} </div>
        )}

        <div className="body">
          {searching && <Spinner radius={120} color="#345C70" stroke={2} visible={true} />}

          {deck_list && deck_list.map((deck) => (
            <div
              className="deck-card"
              style={{ backgroundColor: personalSelectedItem.includes(deck._id) ? '#2225' : '#C0D7DA' }}
              onClick={() => deck.creator === userId &&
                setPersonalSelectedItem(personalSelectedItem.includes(deck._id)
                  ? personalSelectedItem.filter((deckId) => deckId !== deck._id)
                  : [...personalSelectedItem, deck._id]
                )
              }
              onDoubleClick={() => onDeckClickHandle(deck)}
              key={deck._id}
            >
              <div className="deck--meta deck--language-and-owner">
                <div>{deck.deckLang.slice(0, 2)}</div>{deck.creator === userId && <div>Yours</div>}
              </div>
              {deck.deckName}
              <div className="deck--meta deck--mastery-and-length">
                <div>Mastery: {Math.round(deck.performance?.correct[deck.performance?.correct?.length - 1] || 0)}%</div>
                <div>{deck.words?.length} cards</div>
              </div>
            </div>
          ))}
        </div>
      </>

      <div className="modal">
        {useLocation().pathname.split('/personal')[1] && <Close className="cancel" onClick={() => navigate('/')} />}
        <Routes>
          <Route path="card" element={<Card />} />
          <Route path="card/add" element={<CardAdd />} />
          <Route path="card/add/manual" element={<CardAddManual />} />
          <Route path="card/add/auto" element={<CardAddAuto />} />
          <Route path="new-deck" element={<NewDeck />} />
          <Route path="card/learn" element={<CardLearn />} />
          <Route path="card/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </div>
  );
};

export default Personal;

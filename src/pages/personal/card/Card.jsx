import React from 'react';
import './Card.css';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@mui/material"
import { Add as AddIcon, School as SchoolIcon, Quiz as QuizIcon, ContentCopy, Create } from '@mui/icons-material';

const Card = () => {
  const navigate = useNavigate();

  const { _id: deckId, deckName, words, learning } = useSelector(state => state.deck.openDeck)
  
  return (
    <div className='card'>
        <h3>{deckName}</h3>
        <div>
          <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation onClick={() => navigate('add')} >Populate the deck</Button>
          {words?.length ?
            <>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate('guided-learn')}>Guided learning</Button>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate('learn')}>Non-guided learning</Button>
              <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate('quiz')}>Take a quiz</Button>
              <Button startIcon={<Create />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../../more/story-time`)}>Story Time</Button>
            </>:
            <></>
          }
          </div>
    </div>
  )
}

export default Card

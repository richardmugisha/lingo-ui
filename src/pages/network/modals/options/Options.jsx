import React, { useEffect } from 'react';
import './Options.css';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from "@mui/material"
import {  School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';

const Options = () => {
  const navigate = useNavigate();
  const handleRefresh = usePageRefreshHandle()

  const { _id: deckId, deckName, words } = useSelector(state => state.deck.openDeck)

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  return (
    <div className='card'>
        
        <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../play-with-friends`)}>Play with friends</Button>
        <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../random-game-playing/?mode=random`)}>Random game</Button>
        <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../championship`)}>Tournament</Button>
            
    </div>
  )
}

export default Options

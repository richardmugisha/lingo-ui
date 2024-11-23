import React from 'react';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Clear as Close } from '@mui/icons-material';

import { Options, CardAdd, CardAddManual, CardAddAuto, CardLearn, NewDeck, GuidedLearning, Quiz } from "../modals"


export default () =>{
    const navigate = useNavigate()
    return (
    <div className="modal">
        {useLocation().pathname.split('/personal')[1] && <Close className="cancel" onClick={() => navigate('/')} />}
        <Routes>
          <Route path="options" element={<Options />} />
          <Route path="adding" element={<CardAdd />} />
          <Route path="adding/manual" element={<CardAddManual />} />
          <Route path="adding/auto" element={<CardAddAuto />} />
          <Route path="new-deck" element={<NewDeck />} />
          <Route path="learning" element={<CardLearn />} />
          <Route path="guided-learning" element={<GuidedLearning />} />
          <Route path="quiz" element={<Quiz />} />
        </Routes>
      </div>
    )
}
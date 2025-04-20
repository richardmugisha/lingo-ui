import React, { useEffect } from 'react';
import './Options.css';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from "@mui/material"
import { Add as AddIcon, School as SchoolIcon, Quiz as QuizIcon, ContentCopy, Create } from '@mui/icons-material';

const Options = () => {
  const navigate = useNavigate();
  const handleRefresh = usePageRefreshHandle()

  const { _id: topicId, topicName, words } = useSelector(state => state.topic.openTopic)

  useEffect(() => {
    handleRefresh(topicId)
  }, [topicId])  

  return (
    <div className='card'>
        <h3>{topicName}</h3>
        <div>
          <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation onClick={() => navigate(`../adding/?topic=${topicId}`)} >Populate the topic</Button>
          {words?.length ?
            <>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../guided-learning/?topic=${topicId}`)}>Guided learning</Button>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../learning/?topic=${topicId}`)}>Non-guided learning</Button>
              <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../quiz/?topic=${topicId}`)}>Take a quiz</Button>
              <Button startIcon={<Create />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../../../more/story-time/?topic=${topicId}`)}>Story Time</Button>
              <Button startIcon={<Create />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../../../more/chat-time/?topic=${topicId}`)}>Chat Time</Button>
            </>:
            <></>
          }
          </div>
    </div>
  )
}

export default Options



import React, { useEffect, useState } from 'react'
import "./Lobby.css"
import fetchAll from '../../../../../../api/http/topic/fetchAll'
import WebSocketService from '../../../../../../api/ws'
import fetchOne from '../../../../../../api/http/topic/fetchOne'

const Lobby = ({topic, setGameInfo, gameInfo}) => {
    console.log(topic)
    const [topics, setTopics] = useState([])

    useEffect(() => {
        fetchAll().then(data => {
            console.log(data)
            setTopics(data?.topics || [])
        })
    }, [])

    const selectTopic = (_topic) => {
        fetchOne(_topic._id).then(topic => {
            setGameInfo(prev => ({...prev, data: {...gameInfo.data, topic}}))
            WebSocketService.send("game/lobby", {...gameInfo, data: {...gameInfo.data, topic}})
        })
    }

  return (
    <div className='lobby'>
        <h2>{ topic?.topicName ? "The quiz will be on this topic" : "Pick a topic for this quiz"}
        </h2>
        {
            topic.topicName ? 
            <div className='topic'>{topic.topicName}</div> :
        
            <ul>
                {
                    topics.map(topic => 
                                <span className='topic' onClick={() => selectTopic(topic)}
                                >{topic.topicName}</span>
                            )
                }
            </ul>
        }
    </div>
  )
}

export default Lobby
import React, { useState, useEffect } from 'react'
import "./RabbitHole.css"

import { getAgents, liveChat } from "../../api/http"

import { HomeMax as Maximize, Maximize as Minimize } from '@mui/icons-material';

import { useSelector } from 'react-redux';


const RabbitHole = () => {
  const [maximized, setMaximized] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [chats, setChats] = useState([])
  const [isRabbitHoleOpen, setIsRabbitHoleOpen] = useState(false)
  const [{ username, userId: userID}] = useState(JSON.parse(localStorage.getItem("user")))
  const { chat: messageObject } = useSelector(state => state.system)

  useEffect(() => {
    if (!messageObject?.reply) return;
    setIncomingMessage(messageObject.reply)
  }, [messageObject])


  useEffect(() => {
    if (!incomingMessage) return;
    setChats(prev => [...prev, {sender: "assistant", text: incomingMessage}])
    setIsRabbitHoleOpen(true)
  }, [incomingMessage])

  const handleSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (userMessage.trim() !== "") {
        setChats([...chats, { sender: "user", text: userMessage }]);
        liveChat({userID, chat: userMessage})
          .then( ({ reply }) => setIncomingMessage(reply))
        }
        setUserMessage("");
    }
  }

  useEffect(() => {
    getAgents()
      .then(agents => {
        liveChat({userID, username, agentPair: {supervisor: agents[1]}, type: "casual"})
      }).catch(e => null)
  }, [])

  return (
    <>
      {isRabbitHoleOpen &&
        <article className={`rabbit-hole${maximized ? ' maximized' : ''}`}>
            <button className="maximize-btn" onClick={() => setMaximized(m => !m)}> {maximized ? <Minimize /> : <Maximize /> } </button>
            <h2>Ra🐰it hole</h2>
            <section className='chat'>
                {
                    chats.map((chat, index) => <p key={index} className={chat.sender}>{chat.text}</p>)
                }
            </section>
            <textarea name="" id="" placeholder="Knock yourself out!" onKeyDown={handleSubmit} onChange={e => setUserMessage(e.target.value)} value={userMessage}></textarea>
        </article>
        }
        <button className="rabbit-toggle" onClick={() => setIsRabbitHoleOpen(!isRabbitHoleOpen)} title={isRabbitHoleOpen ? "Close the Rabbit Hole" : "Open the Rabbit Hole"} aria-label={isRabbitHoleOpen ? "Close the Rabbit Hole" : "Open the Rabbit Hole"}>🐰</button>
    </>
  )
}

export default RabbitHole
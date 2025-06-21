import React, { useState, useEffect, useRef } from 'react'
import "./RabbitHole.css"

import AgentsList from '../../components/agentsList/AgentsList';

import {  liveChat } from "../../api/http"

import { HomeMax as Maximize, Maximize as Minimize } from '@mui/icons-material';

import { useSelector } from 'react-redux';


const RabbitHole = () => {
  const [maximized, setMaximized] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [chats, setChats] = useState([])
  const [isRabbitHoleOpen, setIsRabbitHoleOpen] = useState(false)
  const [{ username, userId: userID}] = useState(JSON.parse(localStorage.getItem("user")))
  const [supervisor, setSupervisor ] = useState(null)
  const { chat: messageObject } = useSelector(state => state.system)
  
  // Add ref for chat section
  const chatSectionRef = useRef(null);

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
      if (!supervisor) return
      liveChat({userID, username, agentPair: { supervisor }, type: "casual"})
      .catch(e => null)
  }, [supervisor])

  // Add auto-scroll effect
  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <>
      {isRabbitHoleOpen ?
        supervisor ?
          <article className={`rabbit-hole${maximized ? ' maximized' : ''}`}>
              <button className="maximize-btn" onClick={() => setMaximized(m => !m)}> {maximized ? <Minimize /> : <Maximize /> } </button>
              <h2>Ra🐰it hole</h2>
              <section className='chat' ref={chatSectionRef}>
                  {
                      chats.map((chat, index) => <p key={index} className={chat.sender}>
                      {chat.text}
                      </p>)
                  }
              </section>
              <textarea name="" id="" placeholder="Knock yourself out!" onKeyDown={handleSubmit} onChange={e => setUserMessage(e.target.value)} value={userMessage}></textarea>
          </article> :
          <AgentsList setSupervisor={setSupervisor} /> : 
          <></>
        }
        <button className="rabbit-toggle" onClick={() => setIsRabbitHoleOpen(!isRabbitHoleOpen)} title={isRabbitHoleOpen ? "Close the Rabbit Hole" : "Open the Rabbit Hole"} aria-label={isRabbitHoleOpen ? "Close the Rabbit Hole" : "Open the Rabbit Hole"}>🐰</button>
        {isRabbitHoleOpen && <span className='rabbit-hole-supervisor'><img src={supervisor?.imageUrl} alt="" /></span>}
        
    </>
  )
}

export default RabbitHole
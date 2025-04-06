
import React, { useEffect, useState } from 'react'

import ChatRoom from "./components/ChatRoom"

import Yapping from '../Yapping'

import scriptGen from "../../../../api/http/chat/createScript"
import { useSelector } from 'react-redux'


const Chat = ({ }) => {
  const { userId: userID, username } = JSON.parse(localStorage.getItem("user"))
  const { learning: deck, _id: deckId, words: cards } = useSelector((state) => state.deck.openDeck);
  const [chatInfo, setChatInfo] = useState({
        type: "chat", creator: userID, status: "lobby",
        players: {
          [participants[0].id]: participants[0],
          [participants[1].id]: participants[1],
          [participants[2].id]: participants[2],
        }, 
        words: deck.words.map(wordObj => wordObj.word),
        data: {mode: "create", step: "onboarding"}})

  useEffect(() => {
    if (chatInfo.data.step === "create") {
      scriptGen(chatInfo.data.title, chatInfo.data.summary, chatInfo.words, Object.values(chatInfo.players).map(p => ({name: p.name, isMain: p.isMain})))
      .then(script => setChatInfo(prev => ({...prev, script})))
    }
  }, [chatInfo.data.step])

  return (
    chatInfo.data.step === "onboarding" ?
    <Yapping gameInfo={chatInfo} setGameInfo={setChatInfo} userID={userID}/> :
    <ChatRoom 
      chatInfo={chatInfo} setChatInfo={setChatInfo}
      username={username}
    />
  )
}


export default Chat

const participants = [
  {
    id: 0,
    name: "John",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false
  },
  {
    id: 1,
    name: "Richard",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: true,
  },
  {
    id: 2,
    name: "Mugisha",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false,
    isMain: true
  }
];
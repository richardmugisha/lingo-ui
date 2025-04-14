
import React, { useEffect, useState } from 'react'

import ChatRoom from "./components/ChatRoom"

import Yapping from '../Yapping'

import scriptGen from "../../../../api/http/chat/createScript"
import { waitForLine0 } from '../utils/rolePlaying'
import { useSelector } from 'react-redux'
import { awsUrl } from '../../../../../serverConfig'

import Button from '../../../network/modals/playing/components/game-button/Button'

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
        data: {step: "catalog"}})

  useEffect(() => {
    console.log('some', chatInfo.data)
    if (chatInfo.data.step === "create") {
      scriptGen(chatInfo.data.title, chatInfo.data.summary, chatInfo.words, Object.values(chatInfo.players).map(p => p), deckId, userID)
      .then(script => setChatInfo(prev => ({...prev, data: {...script, step: "temporary step", mode: "practice"}})))
    }
    else if (chatInfo.data.step === "temporary step") {
      waitForLine0(5, 7000, chatInfo.data.title, awsUrl).then(exists => {
          console.log(exists)
          if (exists) setChatInfo({...chatInfo, data: {...chatInfo.data, step: "practice"}})
        }
      )
    }
  }, [chatInfo.data.step])

  return (
    <>
    { chatInfo.data?.step === "catalog" ?
      <Yapping gameInfo={chatInfo} setGameInfo={setChatInfo} userID={userID}/> :
      <Yapping gameInfo={chatInfo} setGameInfo={setChatInfo} userID={userID}/>
    }
    {
      chatInfo.data?.step === "create" && <p>...loading...</p>
    }
    {
      chatInfo.data.step === "temporary step" && 
      <div style={{flexDirection: "column"}}>
        <p style={{fontSize: "1.4em", maxWidth: "600px", lineHeight: "1.7em"}}>
          { chatInfo.data.summary}
        </p>
        <br /><br /><br />
        <p>... Get ready to role play</p>
      </div>
    }
    
    { chatInfo.data.step === "practice" &&
      <div style={{flexDirection: "column"}}>
        <ChatRoom 
          chatInfo={chatInfo} setChatInfo={setChatInfo}
          username={username}
        />
        <Button text="Practice again" 
          handleClick={() => setChatInfo(
            {
              type: "chat", creator: userID, status: "lobby",
              players: {
                [participants[0].id]: participants[0],
                [participants[1].id]: participants[1],
                [participants[2].id]: participants[2],
              }, 
              words: deck.words.map(wordObj => wordObj.word),
              data: {step: "catalog"}
            })} 
        />
      </div>
    }
    </>
  )
}


export default Chat

const participants = [
  {
    id: 0,
    name: "Missy",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false,
    sex: 'F'
  },
  {
    id: 1,
    name: "Jonathan",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: true,
    sex: 'M'
  },
  {
    id: 2,
    name: "Mugisha",
    avatar: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false,
    isMain: true,
  }
];
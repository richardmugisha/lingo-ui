import "./Playing.css"

import Counter from "./utils/Counter";

import { initializeWebSocketConn } from "../../../../api/quiz-game/websocket"

import QuizCard from "../../../personal/modals/quiz/quiz-card/QuizCard";
import WaitingRoom from "../waiting-room/WaitingRoom";

import { useSelector } from "react-redux";

import PlayersDashboard from "./components/player-state/PlayerDashboard";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";



const Playing = () => {
    const socketHasInitRef = useRef(false)
    const socketHasSetup = useRef(false)
    const [socket, setSocket ] = useState(null)
    const { _id: deckId, deckName, words, learning:deck } = useSelector(state => state.deck.openDeck)
    const [searchParams, setSearchParams] = useSearchParams()
    const [{userId: playerID, username: playerName, avatar}] = useState(JSON.parse(localStorage.getItem('user')));
    const [ gameID, setGameID ] = useState(searchParams.get("gameID"))
    const [ isCreator ] = useState(searchParams.get("isCreator") === "true")
    const [randomGame ] = useState(searchParams.get("mode") === "random")
    const [players, setPlayers] = useState([])
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(isCreator ? "creating" : "joining") // creating | joining | waiting | countdown | playing

    useEffect(() => {
      if (socketHasInitRef.current) return;
      setSocket(initializeWebSocketConn());
      socketHasInitRef.current = true
    }, []);

    useEffect(() => {
      if (socketHasSetup.current) return
      if (!socket) return
      socketHasSetup.current = true
      const handleOpen = () => {
        if (playerID && gameID) {
          socket.send(
            JSON.stringify({
              method: "join",
              payload: { playerID, gameID, playerName, avatar },
            })
          );
        } else if (playerID && isCreator && !gameID) {
          socket.send(
            JSON.stringify({
              method: "create",
              payload: { playerID, playerName, avatar },
            })
          );
        } else if (playerID && randomGame) {
          console.log(playerID, randomGame)
          socket.send(
            JSON.stringify({
              method: "join",
              payload: { playerID, mode: "random", playerName, avatar },
            })
          );
        }
      };

      socket.addEventListener("open", handleOpen)
      
      const handleMessage = (event) => {
        const { method, payload } = JSON.parse(event.data);
        console.log(payload)
        if (["join", "create"].includes(method)) {
          const { gameID, playerID, status: statusCode } = payload;
          if (statusCode === 404) return setError(404)
          setSearchParams({ gameID, playerID });
          setGameID(prev => prev || gameID)
          setPlayers(payload.players)
          setStatus("waiting");
          console.log('status')
        } else if (method === "waiting-room-update" && payload?.players) {
          setPlayers(payload.players);
        } else if (method === "command" && payload?.command === "start") {
          setStatus("countdown");
        }
      };

      socket.addEventListener("message", handleMessage)
      
      console.log('being triggered')
      return () => {
        socket.onopen = null; // Clear open handler
        socket.onmessage = null; // Clear message handler
        if (socket.readyState === WebSocket.OPEN) {
          console.log("closing socket")
          socket.close();
        }
      };
    }, [socket])
   
    const handleStart = () => {
      socket.send(JSON.stringify({method: "command", payload: {command: "start", gameID}}))
    }
    return (
      <>
      {
        ["waiting", "creating", "joining"].includes(status) ?
        <WaitingRoom players={players?.length ? players : []} isCreator={isCreator} gameID={gameID} handleStart={handleStart} error={error} playerID={playerID}/> :
        <> 
        {
          status === "countdown" ? <Counter status={status} setStatus={setStatus} /> :
          deck.words.length ? <PlayingManager socket={socket} deck={deck} gameID={gameID} playerID={playerID}/> : <>Error getting the game set!</>  
        }
        </>
      }
      </>
    )
    
    
}

export default Playing

const formatRouter = (lev) => {
    const level = lev % 6
    if (level === 0 ) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'meaning'
    }
    if (level === 1) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'example'
    }
    if (level === 2) return {
      quizLength: 'long',
      route: 'quiz-long-mcq',
      quizType: 'meaning'
    }
    if (level === 3) return {
      quizLength: 'long',
      route: 'quiz-long-mcq',
      quizType: 'example'
    }
    if (level === 4) return {
      quizLength: 'short',
      route: 'quiz-long-mcq',
      quizType: 'synonym'
    }
    if (level === 5) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'meaning'
    }
  }

const PlayingManager = ({ socket, deck, gameID, playerID }) => {
  if (!socket) return
  const [afterUpdateFunc, setAfterUpdateFunc ] = useState(null)
  const [players, setPlayers] = useState([])

  const handlePlay = (afterPlayHandle) => { // The call back is what happens after the server responds to the play
    const [ correct, registerPlay ] = afterPlayHandle
    socket.send(JSON.stringify({method: "play", payload: {playerID, gameID, isCorrect: correct}}))
    setAfterUpdateFunc(() => registerPlay)
  }

  useEffect(() => {
    socket.onmessage = event => {
      const { method, payload } = JSON.parse(event.data)
      if (method === "play") {
        // nothing to do for now
      }
      else if (method === "playing-update") {
        if (afterUpdateFunc) {
          afterUpdateFunc()
        }
        setPlayers(payload.players || [])
      }
    }
  }, [afterUpdateFunc])

  return (
    <>
      
      <PlayersDashboard players={players} gameID={gameID} socket={socket} playerID={playerID}/>
      <QuizCard 
          importedFormat={'placeholder'} importedQuizType={'placeholder'}
          importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={deck} mode={"quiz-game"} 
          formatRouter={formatRouter} setUserDecision={''} 
          handlePlay={handlePlay}
      />
    </>
  )
}

import "./Playing.css"

import Counter from "./utils/Counter";

import { initializeWebSocketConn } from "../../../../api/quiz-game/websocket"

import QuizCard from "../../../personal/modals/quiz/quiz-card/QuizCard";
import WaitingRoom from "../waiting-room/WaitingRoom";

import Yapping from "../../../external/yapping/Yapping";

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
    const [typeOfGame] = useState(searchParams.get("type-of-game") || 'story') // quiz | story
    const [players, setPlayers] = useState([])
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(isCreator ? "creating" : "joining") // creating | joining | waiting | countdown | playing
    const [storyGameUtils, setStoryGameUtils] = useState({activity: "onboarding"})
    // const [exportStoryGameUtils, setExportStoryGameUtils] = useState({})

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
          if (statusCode === 404) {console.log("error========");return setError(404)}
          setSearchParams({ gameID, playerID });
          setGameID(prev => prev || gameID)
          setPlayers(payload.players)
          setStatus("waiting");
        } else if (method === "waiting-room-update") {
          if (typeOfGame === "story") {
            if (payload.storyGameUtils?.title) setStoryGameUtils(prev => ({...prev, title: payload.storyGameUtils.title}))
            if (payload.storyGameUtils?.summary) setStoryGameUtils(prev => ({...prev, summary: payload.storyGameUtils.summary}))
          } 
          setPlayers(prevPlayers => {
            if (payload.players?.length && prevPlayers.length !== payload.players?.length) return payload.players;
            return prevPlayers
          });
        } else if (method === "command" && payload?.command === "start") {
          setStatus("countdown");
        }
        else if (method === "switch-activity" && payload.activity) setStoryGameUtils(prev => ({...prev, activity: payload.activity}))
      };

      socket.addEventListener("message", handleMessage)
      
      // console.log('being triggered')
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log("closing socket")
          socket.send(JSON.stringify({method: "disconnect", payload: {gameID, playerID}}))
          socket.close();
        }
        socket.onopen = null; // Clear open handler
        socket.onmessage = null; // Clear message handler
      };
    }, [socket])

    useEffect(() => {
      // console.log(storyGameUtils, typeOfGame === "story", storyGameUtils.activity === "onboarding",
      //   isCreator, (players.length > 1), !(players.length === storyGameUtils.playerCount),
      //  (storyGameUtils?.title || storyGameUtils?.summary))
      if (typeOfGame === "story" && storyGameUtils.activity === "onboarding" &&
        isCreator && (players.length > 1) && !(players.length === storyGameUtils.playerCount) &&
       (storyGameUtils?.title || storyGameUtils?.summary)
      ) {
        setStoryGameUtils(prev => {
          prev.playerCount = players.length;
          socket.send(JSON.stringify({method: "title-and-summary", payload: {gameID, playerID, storyGameUtils: prev, players}}));
          return prev
        })
      }
    }, [players, storyGameUtils])

    const handleStart = () => {
      socket.send(JSON.stringify({method: "command", payload: {command: "start", gameID}}))
    }

    const StoryView = <Yapping isGameCreator={isCreator} mode={"game-onboarding"} 
                                storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
                      />

    return (
      <>
      {
        ["waiting", "creating", "joining"].includes(status) && storyGameUtils.activity === "onboarding" ?
        <>
          { typeOfGame === "story" && StoryView}
          <WaitingRoom typeOfGame={typeOfGame} players={players?.length ? players : []} isCreator={isCreator} gameID={gameID} handleStart={handleStart} error={error} playerID={playerID}/>
        </> :
        <> 
        {
          status === "countdown" ? <Counter status={status} setStatus={setStatus} /> :
          deck.words.length ? 
            <PlayingManager isCreator={isCreator} typeOfGame={typeOfGame} socket={socket} 
              deck={deck} gameID={gameID} playerID={playerID}
              storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
              StoryView={StoryView}
            /> 
            : <>Error getting the game set!</>  
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

const PlayingManager = ({ isCreator , typeOfGame, socket, deck, gameID, playerID, storyGameUtils, setStoryGameUtils, StoryView }) => {
  // console.log("....Playing")
  if (!socket) return
  const [afterUpdateFunc, setAfterUpdateFunc ] = useState(null)
  const [players, setPlayers] = useState([])
  const [voting, setVoting] = useState(false)

  const handlePlay = (afterPlayHandle) => { // The call back is what happens after the server responds to the play
    const [ correct, registerPlay ] = afterPlayHandle
    socket.send(JSON.stringify({method: "play", payload: {playerID, gameID, isCorrect: correct}}))
    setAfterUpdateFunc(() => registerPlay)
  }

  useEffect(() => {
    console.log(storyGameUtils.source, storyGameUtils.currSentence)
    if (storyGameUtils.currSentence) {
      socket.send(JSON.stringify({method: "add-new-sentence", payload: {gameID, playerID, storyGameUtils}}))
    }
  }, [storyGameUtils.currSentence])

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
      else if (method === "all-players-wrote") {
        setStoryGameUtils(prev => ({...prev, voting: true, source: "external", currSentences: payload.currSentences}))
      }
      else if (method === "voted-sentence") {
        setStoryGameUtils(prev => ({...prev, source: "external", votedSentence: payload.votedSentence}))
      }
      else if (method === "switch-activity") {
        console.log(payload)
        if (payload.activity === "" && payload.story) return setStoryGameUtils(prev => ({...prev, source: "external", activity: payload.activity, story: payload.story}))
        setStoryGameUtils(prev => ({...prev, source: "external", activity: payload.activity}))
      }
    }
  }, [afterUpdateFunc])

  useEffect(() => {
    if (storyGameUtils.currSentences) setVoting(true)
  }, [storyGameUtils.currSentences])

  useEffect(() => {
    console.log(storyGameUtils.activity)
    if ( storyGameUtils.source !== "external" && (storyGameUtils.activity || storyGameUtils.activity === "")) {
      if (storyGameUtils.activity === "uploading") return socket.send(JSON.stringify({method: "switch-activity", payload: {gameID, playerID, ...storyGameUtils}}))
      socket.send(JSON.stringify({method: "switch-activity", payload: {gameID, playerID, activity: storyGameUtils.activity}}))
    }
  }, [storyGameUtils.activity])


  const handleVoting = (e) => {
    const bestSentence = parseInt(e.target.id)
    setVoting(false);
    setStoryGameUtils(prev => ({...prev, voting: false}))
    socket.send(JSON.stringify({method: "voting-best-sentence", payload: {gameID, playerID, bestSentence}}))
  }

  return (
    <>
      
      <PlayersDashboard players={players} gameID={gameID} socket={socket} playerID={playerID}/>
      {typeOfGame === "quiz" ?
        <QuizCard 
          importedFormat={'placeholder'} importedQuizType={'placeholder'}
          importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={deck} mode={"quiz-game"} 
          formatRouter={formatRouter} setUserDecision={''} 
          handlePlay={handlePlay}
        /> :
        StoryView
        // <Yapping isGameCreator={isCreator} mode={"game-creating"} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}/>
      }
      {
        voting ? 
        <Voting currSentences={storyGameUtils.currSentences} handleVoting={handleVoting}/> :
        <></>
      }
    </>
  ) 
}

const Voting = ({ currSentences, handleVoting }) => {
  return (
    <div style={{padding: "1em 2em"}}>
      {
        currSentences.map((currSentence, i) => <div key={i} id={i}
          style={{padding: "1em 2em", background: "lightblue", cursor: "pointer"}} 
          onClick={handleVoting}>
          {currSentence.sentence}</div>
        )
      }
    </div>
  )
}
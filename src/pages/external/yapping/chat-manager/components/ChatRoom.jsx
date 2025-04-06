import ChatTile from './ChatTile';
import './ChatRoom.css';
import ChatTranscript from './ChatTranscript';
import { useEffect, useState } from 'react';
import useChatRoom from './useChatRoom';

import Button from "../../../../network/modals/playing/components/game-button/Button"

// const ChatRoom = ({ playerID, players, setPlayers, storyGameUtils, setStoryGameUtils, isCreator }) => {
const ChatRoom = ({ chatInfo, setChatInfo, username }) => {
  const [lineIndex, setLineIndex] = useState(0)
  const [currentLineObj, setCurrentLineObj] = useState({})
  const [status, setStatus] = useState("waiting")

  useEffect(() => {
    if (chatInfo.script) {
      console.log(chatInfo)
      if (lineIndex < chatInfo.script.script.length) {
        setStatus("in progress")
        setCurrentLineObj(chatInfo.script.script[lineIndex])
      } else {
        setStatus("done")
      }
    }
  }, [chatInfo, lineIndex])

  console.log(currentLineObj)

  const handleBlanksGen = (sentence, words) => {
    const sentChunks = sentence.toLowerCase().trim().split(" ");
    const usedWords = []
    const blanked = sentChunks.map(sentChunk => {
      for (const word of words) {
        const threshold = word.length / 2 > 4 ? word.length / 2 : 5
        if ( sentChunk.slice(0, threshold).includes(word.slice(0, threshold))) {
          usedWords.push(word);
          return '-'.repeat(5)
        }
      }
      return sentChunk
    }).join(" ")

    return { blanked, usedWords }
  }

  return (
    <div className="chat-room">

      <section className="first-section">
        {
          status === "waiting" ? <h2>...Loading</h2> :
          status === "in progress" ? 
          <>
            <h2>{ currentLineObj?.type === "narration" ? "Narration" : `${currentLineObj?.actor}'s line`}</h2>
            {currentLineObj?.actor === username.toLowerCase() &&
              <p>Repharse the line to include the word <span className='line-word'>{handleBlanksGen(currentLineObj.line, chatInfo.words).usedWords[0]}</span></p>
            }
            <hr />
            <p className='actor-line'>
              { currentLineObj.rephrased || currentLineObj?.line }
            </p>
          </> :
          <h2>The END! Thank you for participating</h2>
        }
      </section>

      <section className="second-section">
        <div className="participants-grid">
          {Object.values(chatInfo.players).map((player) => (
            <ChatTile
              key={player.id}
              user={player}
              // audioObj={peers?.[player.playerID]}
              isActive={player.name.toLowerCase() === currentLineObj.actor}
              isLocalUser={player.id === chatInfo.creator}
            />
          ))}
        </div>
      </section>
      
      <section className="third-section">
        {/* <h2>Your rephrased line</h2>
        <hr />
        <ChatTranscript playerID={playerID} players={players} setPlayers={setPlayers} /> */}
        <Button text="Next" handleClick={() => setLineIndex(lineIndex+1)}/>
      </section>

    </div>
  );
};


export default ChatRoom; 
import ChatTile from './ChatTile';
import './ChatRoom.css';
import ChatTranscript from './ChatTranscript';
import { useEffect, useState, useRef } from 'react';
import useChatRoom from './useChatRoom';
import { awsUrl } from '../../../../../../serverConfig';
import prefetchAllAudio from "../../utils/rolePlaying"

import handleBlanksGen from '../../utils/handleBlanks';

import Button from "../../../../network/modals/playing/components/game-button/Button"

// const ChatRoom = ({ playerID, players, setPlayers, storyGameUtils, setStoryGameUtils, isCreator }) => {
const ChatRoom = ({ chatInfo, setChatInfo, username }) => {
  const [lineIndex, setLineIndex] = useState(0)
  const [currentLineObj, setCurrentLineObj] = useState({})
  const [status, setStatus] = useState("waiting")
  const audioRef = useRef(null)

  useEffect(() => {
    if (chatInfo?.data?.title && chatInfo.data?.details?.length > 0) {
      prefetchAllAudio(awsUrl, chatInfo.data.title, chatInfo.data.details.length);
    }
  }, [chatInfo]);
  

  useEffect(() => {
    if (chatInfo.data) {
      // console.log(chatInfo)
      if (lineIndex < chatInfo.data.details?.length) {
        setStatus("in progress")
        setCurrentLineObj(chatInfo.data.details[lineIndex])
      } else {
        setStatus("done")
      }
    }
  }, [chatInfo, lineIndex])

  useEffect(() => {
    if (currentLineObj?.line && (currentLineObj.actor?.toLowerCase() !== username.toLowerCase() || !currentLineObj.rephrased)) {
      playAudioForLine(lineIndex);
    }
  }, [currentLineObj]);

  const playAudioForLine = async (index) => {
    const url = `${awsUrl}/script/${chatInfo.data.title}/audio/line-${index}.wav`;
    try {
      const cache = await caches.open("audio-lines-cache" + chatInfo.data.title);
      const response = await cache.match(url);
  
      if (!response) throw new Error("Audio not cached yet");
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      audioRef.current.src = blobUrl;
      await audioRef.current.play();
    } catch (err) {
      console.error(`Playback failed for line ${index}:`, err);
    }
  };
  
  
  // console.log(currentLineObj)

  // const handleBlanksGen = (sentence, expressions) => {
  //   const sentChunks = sentence.toLowerCase().trim().split(" ");
  //   const usedExpressions = []
  //   const blanked = sentChunks.map(sentChunk => {
  //     for (const expression of expressions) {
  //       let count = 0
  //       for (const word of expression.trim().split(" ")) {
  //         const threshold = Math.max(word.length / 2, 5)
  //         if ( sentChunk.slice(0, threshold).includes(word.slice(0, threshold))) {
  //           count++
            
  //         }
  //       };

  //       if (count >= expression.split(" ").length /2) {
  //         usedExpressions.push(expression);
  //         return '-'.repeat(5)
  //       }

  //     }
  //     return sentChunk
  //   }).join(" ")

  //   return { blanked, usedExpressions }
  // }

  
  return (
    <div className="chat-room">

      <section className="first-section" onClick={() => setCurrentLineObj(prev => currentLineObj.rephrased ? ({...prev, rephrased: null}) : chatInfo.data.details[lineIndex])}>
        {
          status === "waiting" ? <h2>...Loading</h2> :
          status === "in progress" ? 
          <>
            <h2>
              { currentLineObj?.type === "narration" ? "Narration" : 
                currentLineObj.actor === username.toLowerCase() ? "Your line" : `${currentLineObj?.actor}'s line`
              }
            </h2>
            {currentLineObj?.actor === username.toLowerCase() &&
              <p>Repharse the line to include the word <span className='line-word'>{handleBlanksGen(currentLineObj.line, chatInfo.words).usedExpressions[0]}</span></p>
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
              audioElement={audioRef.current}
              isActive={player.name.toLowerCase() === currentLineObj.actor && (currentLineObj.actor !== username.toLowerCase() || !currentLineObj.rephrased)}
            />
          
          ))}
        </div>
      </section>
      
      <section className="third-section">
        {/* <h2>Your rephrased line</h2>
        <hr />
        <ChatTranscript playerID={playerID} players={players} setPlayers={setPlayers} /> */}
        <Button text="Next" handleClick={() => setLineIndex(lineIndex+1)}/>
        <Button text="Restart" handleClick={() => setLineIndex(0)}/>

      </section>
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};


export default ChatRoom; 
import ChatTile from './ChatTile';
import './ChatRoom.css';
import ChatTranscript from './ChatTranscript';
import { useEffect, useState, useRef } from 'react';
import useChatRoom from './useChatRoom';
import { awsUrl } from '../../../../../../serverConfig';
import prefetchAllAudio from "../../utils/rolePlaying"

import handleBlanksGen from '../../utils/handleBlanks';

import Button from "../../../../network/modals/playing/components/game-button/Button"
import ProgressBar from "@ramonak/react-progress-bar";

// const ChatRoom = ({ playerID, players, setPlayers, storyGameUtils, setStoryGameUtils, isCreator }) => {
const ChatRoom = ({ chatInfo, setChatInfo, username }) => {
  const [actIndex, setActIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const [currentLineObj, setCurrentLineObj] = useState({})
  const [status, setStatus] = useState("waiting")
  const [mainCharacter, setMainCharacter] = useState({})
  const audioRef = useRef(null)
  const [readingSpeed, setReadingSpeed] = useState(0); // words per minute
  const [lastLineTime, setLastLineTime] = useState(Date.now());
  const [totalWords, setTotalWords] = useState(0);
  const [currentLineNumber, setCurrentLineNumber] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [lineReadTimes, setLineReadTimes] = useState([]); // Store time taken for each line
  const [averageWordsPerMinute, setAverageWordsPerMinute] = useState(0);

  useEffect(() => {
    if (chatInfo?.data?.title && chatInfo.data?.details?.length > 0) {
      const mainGuy = chatInfo.data.characters.find(char => char.isMain)
      if (mainGuy) setMainCharacter(mainGuy)
      //prefetchAllAudio(awsUrl, chatInfo.data.title, chatInfo.data.details.length);
    }
  }, [chatInfo]);

  console.log(chatInfo)

  const getLineObj = () => {

  }
  

  useEffect(() => {
    if (chatInfo.data) {
      // console.log(chatInfo)
      // if (lineIndex < chatInfo.data.details?.length) {
      if (actIndex >= chatInfo.data.acts.length) {
          setStatus('done')
      }
      else if (sceneIndex >= chatInfo.data.acts[actIndex].scenes.length) {
        setLineIndex(0)
        setSceneIndex(0)
        setActIndex(actIndex + 1)
      }
      else if (lineIndex >= chatInfo.data.acts[actIndex].scenes[sceneIndex].details.length){
        setLineIndex(0)
        setSceneIndex(sceneIndex + 1)
      }
      else {
        setStatus("in progress")
        setCurrentLineObj(chatInfo.data.acts[actIndex].scenes[sceneIndex].details[lineIndex])
      }
    }
  }, [chatInfo, lineIndex, sceneIndex, actIndex])

  useEffect(() => {
    if (currentLineObj?.line && (currentLineObj?.actor?.toLowerCase() != mainCharacter?.firstName?.toLowerCase() || !currentLineObj.rephrased)) {
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

  console.log(currentLineObj)
  
  // Calculate total progress
  const calculateProgress = () => {
    if (!chatInfo?.data?.acts) return 0;
    
    const totalActs = chatInfo.data.acts.length;
    const totalScenes = chatInfo.data.acts.reduce((sum, act) => sum + act.scenes.length, 0);
    const totalLines = chatInfo.data.acts.reduce((sum, act) => 
      sum + act.scenes.reduce((sceneSum, scene) => sceneSum + scene.details.length, 0), 0);
    
    const currentAct = actIndex;
    const currentScene = sceneIndex;
    const currentLine = lineIndex;
    
    const actProgress = (currentAct / totalActs) * 100;
    const sceneProgress = (currentScene / totalScenes) * 100;
    const lineProgress = (currentLine / totalLines) * 100;
    
    return (actProgress + sceneProgress + lineProgress) / 3;
  };

  const handleProgressClick = (e) => {
    if (!chatInfo?.data?.acts?.length) return;
  
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    // Calculate total number of lines
    const flatLines = [];
    chatInfo.data.acts.forEach((act, aIdx) => {
      act.scenes.forEach((scene, sIdx) => {
        scene.details.forEach((line, lIdx) => {
          flatLines.push({ aIdx, sIdx, lIdx });
        });
      });
    });
  
    const targetLineIndex = Math.floor(clickPosition * flatLines.length);
    const target = flatLines[targetLineIndex];
  
    if (target) {
      setActIndex(target.aIdx);
      setSceneIndex(target.sIdx);
      setLineIndex(target.lIdx);
    }
  };
  

  // Calculate total lines and words when chatInfo changes
  useEffect(() => {
    if (chatInfo?.data?.acts) {
      let lines = 0;
      let words = 0;
      chatInfo.data.acts.forEach(act => {
        act.scenes.forEach(scene => {
          scene.details.forEach(detail => {
            lines++;
            words += detail.text.split(/\s+/).length;
          });
        });
      });
      setTotalLines(lines);
      setTotalWords(words);
    }
  }, [chatInfo]);

  // Calculate current line number
  useEffect(() => {
    if (chatInfo?.data?.acts) {
      let lineCount = 0;
      for (let a = 0; a < actIndex; a++) {
        for (let s = 0; s < chatInfo.data.acts[a].scenes.length; s++) {
          lineCount += chatInfo.data.acts[a].scenes[s].details.length;
        }
      }
      for (let s = 0; s < sceneIndex; s++) {
        lineCount += chatInfo.data.acts[actIndex].scenes[s].details.length;
      }
      lineCount += lineIndex;
      setCurrentLineNumber(lineCount);
    }
  }, [actIndex, sceneIndex, lineIndex, chatInfo]);

  // Calculate reading speed when moving to next line
  const calculateReadingSpeed = (currentLine) => {
    const now = Date.now();
    const timeDiff = (now - lastLineTime) / 1000 / 60; // in minutes
    const wordsInLine = currentLine.text.split(/\s+/).length;
    const currentSpeed = wordsInLine / timeDiff;
    
    // Update line read times
    setLineReadTimes(prev => [...prev, { words: wordsInLine, time: timeDiff }]);
    
    // Calculate new average speed (considering last 5 lines for more recent accuracy)
    const recentTimes = [...lineReadTimes, { words: wordsInLine, time: timeDiff }].slice(-5);
    const totalWords = recentTimes.reduce((sum, item) => sum + item.words, 0);
    const totalTime = recentTimes.reduce((sum, item) => sum + item.time, 0);
    const newAverageSpeed = totalWords / totalTime;
    
    setAverageWordsPerMinute(newAverageSpeed);
    setLastLineTime(now);
  };

  // Calculate estimated completion time with more accuracy
  const calculateEstimatedTime = () => {
    if (!averageWordsPerMinute || !totalWords) return 'Calculating...';
    
    // Calculate remaining content
    let remainingWords = 0;
    let remainingLines = 0;
    
    // Count remaining words and lines
    for (let a = actIndex; a < chatInfo.data.acts.length; a++) {
      for (let s = (a === actIndex ? sceneIndex : 0); s < chatInfo.data.acts[a].scenes.length; s++) {
        for (let l = (a === actIndex && s === sceneIndex ? lineIndex : 0); 
             l < chatInfo.data.acts[a].scenes[s].details.length; l++) {
          const line = chatInfo.data.acts[a].scenes[s].details[l];
          remainingWords += line.text.split(/\s+/).length;
          remainingLines++;
        }
      }
    }

    // Calculate average time per word based on recent reading speed
    const avgTimePerWord = 1 / averageWordsPerMinute; // in minutes
    
    // Calculate total remaining time
    const minutesRemaining = remainingWords * avgTimePerWord;
    
    // Add buffer time for potential pauses (10% buffer)
    const bufferedMinutes = minutesRemaining * 1.1;
    
    const now = new Date();
    const completionTime = new Date(now.getTime() + bufferedMinutes * 60000);
    
    // Format the time with more precision
    return completionTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Navigation handlers
  const handlePreviousLine = () => {
    if (lineIndex > 0) {
      setLineIndex(lineIndex - 1);
    } else if (sceneIndex > 0) {
      setSceneIndex(sceneIndex - 1);
      setLineIndex(chatInfo.data.acts[actIndex].scenes[sceneIndex - 1].details.length - 1);
    } else if (actIndex > 0) {
      setActIndex(actIndex - 1);
      const prevAct = chatInfo.data.acts[actIndex - 1];
      setSceneIndex(prevAct.scenes.length - 1);
      setLineIndex(prevAct.scenes[prevAct.scenes.length - 1].details.length - 1);
    }
  };

  const handleNextLine = () => {
    if (currentLineObj) {
      calculateReadingSpeed(currentLineObj);
    }
    setLineIndex(lineIndex + 1);
  };

  const handleRestart = () => {
    setActIndex(0);
    setSceneIndex(0);
    setLineIndex(0);
    setReadingSpeed(0);
    setLastLineTime(Date.now());
  };

  return (
    <div className="chat-room">
      <div className="progress-section">
        <div className="progress-container" onClick={handleProgressClick}>
          <ProgressBar 
            // completed={calculateProgress()} 
            completed={Math.round((currentLineNumber + 1) / totalLines * 100)}
            bgColor="#345C70"
            height=".1em"
            borderRadius="5px"
            labelAlignment="center"
            labelColor="transparent"
          />
        </div>
        
      </div>
      <div className="sections-container">
        <section className="scene-metadata">
          <div className="participants-grid">
            {/* {chatInfo.data.characters?.map((player, index) => (
              <ChatTile
                key={player.firstName + index}
                user={player}
                audioElement={audioRef.current}
                isActive={player.firstName.toLowerCase() === currentLineObj.actor?.toLowerCase() && !currentLineObj.rephrased}
              />
            ))} */}
            <h3>Act {actIndex + 1}:</h3>
            <p>{chatInfo.data.acts[actIndex]?.title || "unavailable act title"}</p>
            <p>Scene: {sceneIndex + 1}</p>
            <p>Line: {lineIndex + 1}</p>
          </div>
        </section>

        <section className="scene-data" onClick={() => setCurrentLineObj(prev => currentLineObj.paraphrased ? ({...prev, paraphrased: null}) : chatInfo.data.acts[actIndex].scenes[sceneIndex].details[lineIndex])}>
          {
            status === "waiting" ? <h2>...Loading</h2> :
            // status === "in progress" ? 
            true ?
            <>
              <h4>
                { currentLineObj?.type === "narration" ? "Narration" : 
                  currentLineObj?.character
                }
              </h4>
              {chatInfo.data.acts[actIndex]?.scenes[sceneIndex]?.words?.length > 0 && handleBlanksGen(currentLineObj.text, chatInfo.data.acts[actIndex].scenes[sceneIndex].words).usedExpressions[0] &&
                <p>Repharse the line to include the word <span className='line-word'>{handleBlanksGen(currentLineObj.text, chatInfo.data.acts[actIndex].scenes[sceneIndex].words).usedExpressions[0]}</span></p>
              }
              <hr />
              <p className='actor-line'>
                { currentLineObj.paraphrased || currentLineObj?.text }
              </p>
            </> :
            <h2>The END! Thank you for participating</h2>
          }
        </section>

      </div>
      <div className="progress-controls">
          <div className="time-info">
            <span className="completion-time">Finish by: {calculateEstimatedTime()}</span>
            <span className="reading-speed">
              {Math.round(averageWordsPerMinute)} wpm
            </span>
          </div>
          <span className="line-progress">Line {currentLineNumber + 1}/{totalLines}</span>
          <div className="control-buttons">
            <button onClick={handlePreviousLine}>⏮</button>
            <button onClick={handleRestart}>⏹️</button>
            <button onClick={handleNextLine}>⏭️</button>
          </div>
        </div>
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};


export default ChatRoom; 
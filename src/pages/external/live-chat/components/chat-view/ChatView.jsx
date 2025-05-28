import React, { useState, useEffect, useRef } from 'react';
import "./ChatView.css"
import MessageInput from '../message-input/MessageInput';
import useChatManager from './useChatManager';

const ChatView = ({ pair }) => {

    const [isMaximized, setIsMaximized] = useState(false);
    const messagesEndRef = useRef(null);
    
    const {
        currentSpeaker,
        messages,
        isProcessing,
        handleStudentMessage,
        getCurrentMessage,
        step, words, wordSuccessAnimation
    } = useChatManager(pair);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Scroll when messages change

    const renderMessage = (message) => {
        return (
        <div className="message-content">
            {message.content}
            {message.type === 'audio' && (
            <audio 
                autoPlay 
                src={message.content}
                style={{ display: 'none' }}
                onEnded={() => {
                // This will be called when the audio finishes playing
                console.log('Audio finished playing');
                }}
            />
            )}
        </div>
        );
    };

    const handleSendMessage = (text) => {
        handleStudentMessage(text);
    };

    return (
        <div className="chat-container">
          <div className={`chat-participants ${isMaximized ? 'maximized' : ''}`}>
            <button 
              className="toggle-view-btn"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Show Messages" : "Hide Messages"}
            >
              {isMaximized ? "📝" : "👥"}
            </button>
            
            {/* <div className={`participant ${currentSpeaker === 'student' ? 'active' : ''}`}>
              <div className="avatar student-avatar">
                <img src="/student-avatar.png" alt="You" />
                {currentSpeaker === 'student' && <div className="mic-indicator">🎤</div>}
              </div>
              <span className="participant-name">You</span>
            </div> */}
            
            {["onboarding", "closing"].includes(step) ?
            <div className={`participant ${currentSpeaker === 'ai1' ? 'active' : ''}`}>
              <div className="avatar ai-avatar">
                <img src={pair.supervisor.imageUrl} alt="AI 1" />
                {currentSpeaker === 'ai1' && <div className="ai-indicator">🤖</div>}
              </div>
              <span className="participant-name">{pair.supervisor.name}</span>
            </div>
            :
            <div className={`participant ${currentSpeaker === 'ai2' ? 'active' : ''}`}>
              <div className="avatar ai-avatar">
                <img src={pair.instructor.imageUrl} alt="AI 2" />
                {currentSpeaker === 'ai2' && <div className="ai-indicator">🤖</div>}
              </div>
              <span className="participant-name">{pair.instructor.name}</span>
            </div>
            }
            <div className="words-container">
            {words?.map((word, index) => (
              <span key={index} className={"word-span" + (wordSuccessAnimation ? " success" : "")}>{word}</span>
            ))}
          </div>
          </div>
    
          {/* <div className="words-container">
            {words?.map((word, index) => (
              <span key={index} className={"word-span" + (wordSuccessAnimation ? " success" : "")}>{word}</span>
            ))}
          </div> */}
    
          {!isMaximized && (
            <div className="chat-messages-container">
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.speaker === 'student' ? 'student-message' : 'ai-message'}`}
                  >
                    {renderMessage(message)}
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )} */}
              </div>
              
              <MessageInput
                onSendMessage={handleSendMessage}
                // isListening={isListening}
                // onStartRecording={startListening}
                // onStopRecording={stopListening}
              />
            </div>
          )}
        </div>
      );
}

export default ChatView
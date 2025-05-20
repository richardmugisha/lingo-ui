import React, { useState, useEffect } from 'react';
import useChatManager from './utils/useChatManager';
import "./Chat.css";
import MessageInput from './components/MessageInput';

const Chat = () => {
  const [isMaximized, setIsMaximized] = useState(false);
 
  const {
    currentSpeaker,
    messages,
    isProcessing,
    handleStudentMessage,
    getCurrentMessage
  } = useChatManager();


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
        
        <div className={`participant ${currentSpeaker === 'student' ? 'active' : ''}`}>
          <div className="avatar student-avatar">
            <img src="/student-avatar.png" alt="Student" />
            {currentSpeaker === 'student' && <div className="mic-indicator">🎤</div>}
          </div>
          <span className="participant-name">Student</span>
        </div>
        
        <div className={`participant ${currentSpeaker === 'ai1' ? 'active' : ''}`}>
          <div className="avatar ai-avatar">
            <img src="/ai1-avatar.png" alt="AI 1" />
            {currentSpeaker === 'ai1' && <div className="ai-indicator">🤖</div>}
          </div>
          <span className="participant-name">AI Assistant 1</span>
        </div>

        <div className={`participant ${currentSpeaker === 'ai2' ? 'active' : ''}`}>
          <div className="avatar ai-avatar">
            <img src="/ai2-avatar.png" alt="AI 2" />
            {currentSpeaker === 'ai2' && <div className="ai-indicator">🤖</div>}
          </div>
          <span className="participant-name">AI Assistant 2</span>
        </div>
      </div>

      {!isMaximized && (
        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.speaker === 'student' ? 'student-message' : 'ai-message'}`}
              >
                {renderMessage(message)}
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            
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
};

export default Chat;
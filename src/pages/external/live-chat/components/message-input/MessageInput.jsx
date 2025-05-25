import React, { useState, useRef } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, isListening, onStartRecording, onStopRecording }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleVoiceNote = () => {
    if (isRecording) {
      onStopRecording();
      setIsRecording(false);
    } else {
      onStartRecording();
      setIsRecording(true);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSend} className="message-input-form">
        <button 
          type="button" 
          className={`voice-note-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceNote}
          title={isRecording ? "Stop Recording" : "Start Voice Note"}
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={isRecording}
        />
        
        <button 
          type="submit" 
          className="send-btn"
          disabled={!message.trim() && !isRecording}
        >
          {message.trim() ? "➤" : "📎"}
        </button>
      </form>
      
      {isRecording && (
        <div className="recording-indicator">
          Recording... <span className="recording-dot"></span>
        </div>
      )}
    </div>
  );
};

export default MessageInput; 
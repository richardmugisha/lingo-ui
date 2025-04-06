import { useState, useEffect, useRef } from 'react';
import './ChatTile.css';

const ChatTile = ({ user, isActive, isLocalUser, stream }) => {
 

  return (
    <span className="chat-tile">
      <div 
        className="voice-indicator" 
        style={isActive ? { 
          transform: `scale(${1.7})`,
          transition: 'transform 0.1s ease-out',
          borderColor: "red"
        } : {}}
      >
        <div className={`avatar`}>
          <img src={user.avatar} alt={user.name} />
        </div>
      </div>
      <div className="user-name">{user.name}</div>
      <audio key={user.id} 
            // ref={audioRef} 
      autoPlay></audio>
    </span>
  );
};

export default ChatTile; 
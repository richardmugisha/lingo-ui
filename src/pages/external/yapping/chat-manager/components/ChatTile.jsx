import { useState, useEffect, useRef } from 'react';

import './ChatTile.css';

const ChatTile = ({ user, isActive, audioElement}) => {
//  console.log(audioElement, "at least")

  return (
    <span className="chat-tile">
      <div 
        className={`${isActive ? "voice-indicator" : ""}`} 
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

export default ChatTile
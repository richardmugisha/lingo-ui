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
          <img src={user.avatar || "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png"} alt={user.firstName} />
        </div>
      </div>
      <div className="user-name">{user.firstName}</div>
      <audio key={user.firstName} 
            // ref={audioRef} 
      autoPlay></audio>
    </span>
  );
};

export default ChatTile
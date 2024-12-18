
import "./WaitingRoom.css"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

const WaitingRoom = ({ gameID, players, isCreator, handleStart, error, playerID }) => {
  const navigate = useNavigate()
  return (
    <div className="waiting-room">
        { gameID ?
          <>
            <div>
              <label htmlFor="">Share Game ID: {gameID}</label>
              <p>or</p>
              <Button variant="contained" disableElevation color='primary' /*onClick={handleCopy}*/ >Copy and share link</Button>
            </div> 
        
            <h2>Waiting for {5 - players.length} players</h2>
            <ul>
                {players.map((player, i) => <li key={player?.playerID}>{player?.playerID === playerID ? "You": player?.playerName} joined</li>)}
            </ul>
            { isCreator &&
              <Button variant="contained" disableElevation color='primary' onClick={handleStart}>Start</Button>
            }
          </>
          : 
          error === 404 ?
          <div>No existing game 
          <button onClick={() => navigate("../play-with-friends")}>Create one</button>
          </div> : 
          <></>
        }
    </div>
  )
}

export default WaitingRoom

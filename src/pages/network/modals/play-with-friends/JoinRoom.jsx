import { Button } from "@mui/material"
import { useNavigate, useLocation } from 'react-router-dom';

import { initializeWebSocketConn, getWebSocketConn } from "../../../../api/quiz-game/websocket"

import './JoinRoom.css'

export default ({ mode }) => {
    const navigate = useNavigate();

    const baseUrl = "http://localhost:3000/portal/network/waiting-room"

    const label = mode === 'friends' ? 'Create a new game' : 'Join a random game'
    const to = mode === 'friends' ? 'create-new-game' : 'waiting-room'

    const handleCreateOrJoin = () => {
        navigate(`playing/?isCreator=${true}`)
    }

    const handleStart = () => {
        const gameIdInput = document.getElementById("gameIdInput")
        const gameID = gameIdInput.value

        navigate(`playing/?gameID=${gameID}`)
    }

    return (
        <div className="join-room">
            <div>
                <label htmlFor="">Enter Game ID:</label>
                <input type="text" id="gameIdInput"/>
                <Button variant="contained" disableElevation color='primary' onClick={handleStart}>Join</Button>
            </div>
            <p>or</p>
            <Button variant="contained" disableElevation color='primary' onClick={handleCreateOrJoin}>{label}</Button>
        </div>
    )
}
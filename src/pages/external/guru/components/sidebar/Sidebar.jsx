
import React from 'react'
import useControls from './useControls'
import useAI from './useAI';
import { useData } from '../../useData';
import { Button } from '@mui/material'
import { Edit, Create } from '@mui/icons-material'

const Sidebar = ({ currentChat, setCurrentChat }) => {
    const { getSubtopics, data, topicChain, handleCreateChat, handleNavigateToChat } = useData(currentChat, setCurrentChat)
    const { width, handleIncreaseWidth, handleDecreaseWidth, toggleFullScreen } = useControls(topicChain);
    useAI(currentChat, setCurrentChat);

    // console.log(topicChain, currentChat)
    // console.log(data.chats?.[topicChain[1]]?.title)
    return (
        <div className='guru-sidebar' style={{ width }}>
            <div className='guru-sidebar-header'>
                <h1 onClick={toggleFullScreen}>Guru</h1>
                {/* {width >= 1/5 && (   
                    <div className="controls">
                        <span onClick={handleDecreaseWidth}>-</span>
                        <span onClick={toggleFullScreen}>+</span>
                    </div>
                )} */}
            </div>
            <div className="guru-sidebar-body">
                { topicChain.map((topic, idx) => (
                    <div style={(width == "210px" && idx !== topicChain.length - 2) ? { display: "none" } : {}} key={topic + idx}>{ 
                        getSubtopics(topic, idx)?.map((subtopic, idxx) => 
                            <p key={subtopic + data.chats?.[subtopic]?.title || "Untitled"}
                                style={{borderBottom: topicChain.includes(subtopic) ? "1px solid": "none"}} 
                                onClick={() => handleNavigateToChat(subtopic, idx)}
                            >{data.chats?.[subtopic]?.title || "Untitled" + idx + "" + idxx}</p>) 
                        }
                        <br />
                        {
                            (getSubtopics(topic, idx)?.length > 0 || idx == 0) && 
                            <>
                                <Button variant="outlined" color="primary" startIcon={<Edit />} onClick={() => handleCreateChat(idx)} sx={{ border: 'none' }}>
                                    Add Chat
                                </Button>
                                <Button variant="outlined" color="secondary" startIcon={<Create />} onClick={() => handleCreateChat()} sx={{ border: 'none' }}>
                                    Subtopic
                                </Button>
                            </>
                        }
                    </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar

{/* <div>
                    { Object.keys(data.structure || {}).map(subtopic => 
                        <p key={subtopic}
                            style={{backgroundColor: currentChat?._id === subtopic ? "green" : topicChain.includes(subtopic) ? "#86A8B8": ""}} 
                            onClick={() => handleEnterTopic(subtopic, 0)}
                        >{data[subtopic]?.title || "Untitled"}</p>) }
                    <br />
                    <p onClick={handleCreateChat}>{"New Chat"}</p>
                    <p onClick={handleCreateChat}>{"Dig deep"}</p>
                </div> */}
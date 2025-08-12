
import React from 'react'
import useControls from './useControls'
import useAI from './useAI';
import { useData } from '../../useData';

const Sidebar = ({ currentChat, setCurrentChat }) => {
    const { getSubtopics, data, topicChain, handleCreateChat, handleNavigateToChat } = useData(setCurrentChat)
    const { width, handleIncreaseWidth, handleDecreaseWidth, toggleFullScreen } = useControls(topicChain);
    const { title, summary } = {} //useAI(currentChat)

    // console.log(topicChain, currentChat)
    console.log(data.structure || {}, "Structure Data")
    return (
        <div className='guru-sidebar' style={{ width: `${width * 100}dvw` }}>
            <div className='guru-sidebar-header'>
                <h1 onClick={toggleFullScreen}>Guru</h1>
                {width >= 1/5 && (   
                    <div className="controls">
                        <span onClick={handleDecreaseWidth}>-</span>
                        <span onClick={handleIncreaseWidth}>+</span>
                    </div>
                )}
            </div>
            <div className="guru-sidebar-body">
                { topicChain.map((topic, idx) => (
                    <div>{ 
                        getSubtopics(topic, idx)?.map(subtopic => 
                            <p key={subtopic}
                                style={{backgroundColor: currentChat?._id === subtopic ? "green" : topicChain.includes(subtopic) ? "#86A8B8": ""}} 
                                onClick={() => handleNavigateToChat(subtopic, idx)}
                            >{subtopic}</p>) 
                        }
                        <br />
                        {
                            (getSubtopics(topic, idx)?.length > 0 || idx == 0) && 
                            <>
                                <p onClick={() => handleCreateChat(idx)}>{"New Chat"}</p>
                                <p onClick={() => handleCreateChat()}>{"Dig deep"}</p>
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
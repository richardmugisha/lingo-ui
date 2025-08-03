
import React from 'react'
import useControls from './useControls'
import useAI from './useAI';
import { useData } from '../../useData';

const Sidebar = ({ messages, setMessages }) => {
    const { lineUp, handleEnterTopic, resolveTopic, data, topicChain } = useData()
    const { width, handleIncreaseWidth, handleDecreaseWidth, toggleFullScreen } = useControls(topicChain);
    const { title, summary } = useAI(messages)

    console.log(topicChain, messages)
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
                <div>
                    { Object.keys(data).map(subtopic => <p style={{backgroundColor: topicChain.includes(subtopic) ? "#86A8B8": ""}} onClick={() => handleEnterTopic(subtopic, 0)}>{subtopic}</p>) }
                    <br />
                    <p>{title || "New Chat"}</p>
                </div>
                {   
                    topicChain.map((topic, idx) => (
                        <div>{ 
                            resolveTopic(topic, idx + 1)?.map(subtopic => <p style={{backgroundColor: topicChain.includes(subtopic) ? "#86A8B8": ""}} onClick={() => handleEnterTopic(subtopic, idx + 1)}>{subtopic}</p>) 
                            }
                            <br />
                            <p>New Chat</p>
                        </div>
                    ))
                }
                {/* {
                    lineUp.map(item => <p onClick={() => handleEnterTopic(item)}>{item}</p>)
                } */}
            </div>
        </div>
    )
}

export default Sidebar
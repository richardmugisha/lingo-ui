
import WordCard from '../../../../components/word/Card'
import "./Manager.css"
import { getFyp, updateFyp } from "../../../../api/http"

import React, { useEffect, useState } from 'react'

const Manager = () => {
    const [ fyp, setFyp ] = useState([])
    const [fypState, setFypState] = useState({})

    useEffect(() => {
        getFyp().then(fypData => setFyp(fypData || []))
    }, [])

  return (
    <ul className='fyp-manager'>
        {fyp?.map(word => typeof word === "object" && 
            <li>
                <WordCard wObj={{...word.word, topicID: word.topicID}} />
                <Controls wObj={{...word.word, topicID: word.topicID}} fypState={fypState} setFypState={setFypState} />
            </li>
        )}
    </ul>
  )
}

export default Manager

const Controls = ({ wObj, setFypState, fypState }) => {
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [lastSentKeys, setLastSentKeys] = useState(new Set());

    const handleLike = (topicID, wordID) => {
        setFypState(prev => ({...prev, 
            [wordID]: {
                topicID: topicID, liked: !prev[wordID]?.liked, saved: prev[wordID]?.saved || false
            }
        }))
    }

    const handleFav = (topicID, wordID) => {
        setFypState(prev => ({...prev, 
            [wordID]: {
                topicID: topicID, liked: prev[wordID]?.liked || false, saved: !prev[wordID]?.saved
            }
        }))
    }

    useEffect(() => {
        const now = Date.now();
        const currentKeys = Object.keys(fypState);
        const newKeys = currentKeys.filter(key => !lastSentKeys.has(key));
        const timeElapsed = now - lastUpdateTime;

        const shouldUpdateByTime = timeElapsed >= 60000;
        const shouldUpdateByCount = newKeys.length >= 5;

        if ((shouldUpdateByTime || shouldUpdateByCount) && newKeys.length > 0) {
            const payload = {};
            newKeys.forEach(key => {
                payload[key] = fypState[key];
            });

            updateFyp(payload);

            setLastUpdateTime(now);
            setLastSentKeys(new Set([...lastSentKeys, ...newKeys]));
        }
    }, [fypState]);


    // console.log(fypState)
    return (
        <div className='controls' key={wObj._id}>
            <span onClick={() => handleLike(wObj.topicID, wObj._id)}>
                {
                    fypState[wObj._id]?.liked ? <img width="50" height="50" src="https://img.icons8.com/office/50/filled-like.png" alt="filled-like"/> :
                    <img width="32" height="32" src="https://img.icons8.com/ios/32/hearts--v1.png" alt="hearts--v1"/>
                }
            </span>
            <span><img width="32" height="32" src="https://img.icons8.com/ios/50/speech-bubble-with-dots.png" alt="speech-bubble-with-dots"/></span>
            <span onClick={() => handleFav(wObj.topicID, wObj._id)}>
                {
                    fypState[wObj._id]?.saved ? <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 24 24">
                            <path d="M 4 2 L 4 22 L 12 19 L 20 22 L 20 2 L 6 2 L 4 2 z"></path>
                        </svg> :
                    <img width="32" height="32" src="https://img.icons8.com/windows/32/bookmark-ribbon--v1.png" alt="bookmark-ribbon--v1"/>
                }
            </span>
            <span><img width="32" height="32" src="https://img.icons8.com/ios/50/forward-arrow.png" alt="forward-arrow"/></span>
        </div>
    )
}



import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import Info from '../Info'

let intervalID;

const Toast = ( ) => {
    const [infos, setInfos] = useState([])
    const { info } = useSelector(state => state.system)

    useEffect(() => {
        if (!info?.message) return;
        if (intervalID) clearInterval(intervalID)
        setInfos(prev => [...prev, info])
        intervalID = setInterval(() => {
            setInfos(prev => prev.slice(1))
        }, 3000);
        return () => clearInterval(intervalID);
      }, [info]);
    
  return (
    <div style={{position: "absolute", top: "7em", left: "50%", marginInline: "auto"}}>
        {
            infos.map((info, index) => <Info key={index} info={info}/>)
        }
    </div>
  )
}

export default Toast


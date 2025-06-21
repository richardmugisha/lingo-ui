

import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import Info from '../Info'

const Toast = ( ) => {
    const [infos, setInfos] = useState([])
    const { info } = useSelector(state => state.system)
    const topic = useSelector(state => state.topic)
    // console.log('topic:', topic);

    useEffect(() => {
        console.log(info)
        if (!info?.message) return;
        setInfos(prev => [...prev, info])
        const interval = setInterval(() => {
            setInfos(prev => prev.slice(1))
            if (infos.length === 0) clearInterval(interval)
        }, 3000);
        return () => clearInterval(interval);
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


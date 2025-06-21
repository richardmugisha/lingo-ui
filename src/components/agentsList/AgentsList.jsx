

import React, { useEffect, useState } from 'react'
import { getAgents  } from '../../api/http'
import "./AgentsList.css"

const AgentsList = ({ setSupervisor }) => {
    const [agents, setAgents ] = useState([])
    useEffect(() => {
        getAgents()
            .then(agents => setAgents(agents))
    }, [])

  return (
    <article className='agents'>
    <h2>Select your assistant</h2>
    <div className='agents-list'>
        {
            agents.map(agent => 
            <div className='agent' key={agent._id} onClick={() => setSupervisor(agent)}>
                <img src={agent.imageUrl} alt={agent.name} />
                <p>{agent.name}</p>
            </div>
            )
        }

    </div>
    </article>
  )
}

export default AgentsList
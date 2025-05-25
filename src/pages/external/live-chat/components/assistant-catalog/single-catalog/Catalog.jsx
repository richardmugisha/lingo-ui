import React, { useState, useEffect } from 'react';
import './Catalog.css';
import getAgents from '../../../../../../api/http/live-chat/getAgents';
import getAgentPairs from '../../../../../../api/http/live-chat/getAgentPairs';
import saveAgentPair from '../../../../../../api/http/live-chat/saveAgentPair';

const Catalog = ({ onSavePair, setPage }) => {
  const [selectedAgents, setSelectedAgents] = useState({
    supervisor: null,
    instructor: null
  });
  const [availableAgents, setAvailableAgents] = useState({
    supervisor: [],
    instructor: []
  });
  const [existingPairs, setExistingPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agents, pairs] = await Promise.all([
          getAgents(),
          getAgentPairs()
        ]);
        
        // Filter agents by role
        const supervisorAgents = agents.filter(agent => agent.role === 'supervisor');
        const instructorAgents = agents.filter(agent => agent.role === 'instructor');
        
        setAvailableAgents({
          supervisor: supervisorAgents,
          instructor: instructorAgents
        });
        setExistingPairs(pairs);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAgentSelect = (agent, role) => {
    // Check if the agent is already paired with the other selected agent
    const otherRole = role === 'supervisor' ? 'instructor' : 'supervisor';
    const otherAgent = selectedAgents[otherRole];

    if (otherAgent) {
      const isAlreadyPaired = existingPairs.some(pair => 
        (pair.supervisor._id === agent._id && pair.instructor._id === otherAgent._id) ||
        (pair.supervisor._id === otherAgent._id && pair.instructor._id === agent._id)
      );

      if (isAlreadyPaired) {
        alert('These agents are already paired together.');
        return;
      }
    }

    setSelectedAgents(prev => ({
      ...prev,
      [role]: agent
    }));
  };

  const handleSavePair = async () => {
    if (selectedAgents.supervisor && selectedAgents.instructor) {
      try {
        const response = await saveAgentPair({
          agent1: selectedAgents.supervisor,
          agent2: selectedAgents.instructor
        });
        
        setExistingPairs(prev => [response.agentPair, ...prev]);
        onSavePair(response.agentPair);
        setPage("pair-catalog");
      } catch (error) {
        console.error('Error saving agent pair:', error);
        setError('Failed to save agent pair. Please try again.');
      }
    }
  };

  const handleCreateNewAgent = () => {
    setPage("add-new");
  };

  const onClose = () => {
    setPage("pair-catalog");
  };

  if (loading) {
    return (
      <div className="single-catalog-container">
        <div className="loading-state">Loading agents and pairs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-catalog-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const renderAgentSelection = (role) => {
    const selectedAgent = selectedAgents[role];
    const title = role === 'supervisor' ? 'Supervisors' : 'Instructors';
    const agents = availableAgents[role];

    return (
      <div className="agent-slot">
        <h3>{title}</h3>
        {selectedAgent ? (
          <div className="selected-agent">
            <img src={selectedAgent.imageUrl} alt={selectedAgent.name} />
            <h4>{selectedAgent.name}</h4>
            <p>{selectedAgent.shortDescription}</p>
            <button onClick={() => handleAgentSelect(null, role)}>Change</button>
          </div>
        ) : (
          <div className="agent-grid">
            {agents.map(agent => (
              <div 
                key={agent._id} 
                className="agent-card"
                onClick={() => handleAgentSelect(agent, role)}
              >
                <div className='image-container'><img src={agent.imageUrl} alt={agent.name} /></div>
                <h4>{agent.name}</h4>
                <p>{agent.shortDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="single-catalog-container">
      <h2>Select Agents for Pair</h2>
      
      <div className="agent-selection-area">
        {renderAgentSelection('supervisor')}
        {renderAgentSelection('instructor')}
      </div>

      <div className="action-buttons">
        <button 
          className="save-pair-button"
          onClick={handleSavePair}
          disabled={!selectedAgents.supervisor || !selectedAgents.instructor}
        >
          Save Agent Pair
        </button>
        <button 
          className="create-agent-button"
          onClick={handleCreateNewAgent}
        >
          Create New Agent
        </button>
        <button 
          className="cancel-button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Catalog;

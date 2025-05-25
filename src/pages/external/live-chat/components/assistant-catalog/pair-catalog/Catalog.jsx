import React, { useState, useEffect } from 'react';
import './Catalog.css';
import getAgentPairs from '../../../../../../api/http/live-chat/getAgentPairs';

const Catalog = ({ setPage, setPair }) => {
  const [agentPairs, setAgentPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentPairs = async () => {
      try {
        setLoading(true);
        const pairs = await getAgentPairs();
        setAgentPairs(pairs);
        setError(null);
      } catch (err) {
        setError('Failed to load agent pairs. Please try again.');
        console.error('Error fetching agent pairs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentPairs();
  }, []);

  const handleAddNewPair = () => {
    setPage("single-catalog");
  };

  const handlePairSelect = (pair) => {
    console.log('some pair', pair)
    setPair(pair);
    // setPage("chat"); // Assuming you want to navigate to chat after selection
  };

  if (loading) {
    return (
      <div className="catalog-container">
        <div className="loading-state">Loading agent pairs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h1>Select a pair</h1>
      <br />
      <div className="agent-pairs-grid">
        {agentPairs.map((pair) => (
          <div 
            key={pair._id} 
            className="agent-pair"
            onClick={() => handlePairSelect(pair)}
            style={{ cursor: 'pointer' }}
          >
            <div className="agent-card">
              <h2>{pair.supervisor.name}</h2>
              <div className='image-container'><img src={pair.supervisor.imageUrl} alt={pair.supervisor.name} /></div>
              <p>{pair.supervisor.shortDescription}</p>
            </div>
            <div className="agent-card">
              <h2>{pair.instructor.name}</h2>
              <div className='image-container'><img src={pair.instructor.imageUrl} alt={pair.instructor.name} /></div>
              <p>{pair.instructor.shortDescription}</p>
            </div>
          </div>
        ))}
        <div className="add-agent-box" onClick={handleAddNewPair}>
          <span className="plus-icon">+</span>
          <p>Add Agent</p>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

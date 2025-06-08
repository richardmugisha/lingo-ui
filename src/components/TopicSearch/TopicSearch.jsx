import React, { useState } from 'react';
import { MuiAutoComplete } from '../MuiComponents';
import './TopicSearch.css';

const TopicSearch = ({ 
  topics, 
  searchValue, 
  setSearchValue, 
  suggestions, 
  isLoading, 
  addTopic, 
  removeTopic,
  mode,
  selectedValue, setValue 
}) => {

  return (
    <div className="topic-search">
      <MuiAutoComplete
        label="Search for a topic"
        options={suggestions.map(suggestion => ({
          label: suggestion.name,
          value: suggestion
        }))}
        selectedValue={selectedValue}
        setSelectedValue={(value) => {
          if (value?.value) {
            setValue(value.value?.name)
            addTopic(value.value);
            setSearchValue('');
          }
        }}
        nullOption={{ label: '', value: '' }}
        loading={isLoading}
        inputValue={searchValue}
        onInputChange={setSearchValue}
      />
      
      {topics.length > 0 && mode !== "word-filling-mode" && (
        <div className="selected-topics">
          {topics.map((topic, index) => (
            <div key={index} className="topic-tag">
              {topic.name}
              <button 
                className="remove-topic" 
                onClick={() => removeTopic(topic)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicSearch; 
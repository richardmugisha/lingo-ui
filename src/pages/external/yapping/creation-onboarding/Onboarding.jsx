
import './Onboarding.css'
import { Button } from '@mui/material';
import TopicSearch from '../../../../components/TopicSearch/TopicSearch';
import { useTopicSearch } from '../../../../components/TopicSearch/useTopicSearch';
import StorySetup from '../utils/storySettings';
import { useState } from 'react';

const Onboarding = (
  { storySettings, setStorySettings,
    gameInfo, userID
  }) => {
    const {
      topics,
      searchValue,
      setSearchValue,
      suggestions,
      isLoading,
      addTopic,
      removeTopic
    } = useTopicSearch();

    const [selectedValue, setSelectedValue] = useState(null)

  return (
    <div className='story-onboarding'>
      <h3>You are about to write a short story <br />using these words / expressions found in the topic</h3>
      <TopicSearch
        topics={topics}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        suggestions={suggestions}
        isLoading={isLoading}
        addTopic={addTopic}
        removeTopic={removeTopic}
        selectedValue={selectedValue} setValue={setSelectedValue}
      />
      <div className='side-pool word-pool'>{storySettings.words.map((word, i) => <span key={i}> {word} </span>)}</div>
      <span>
          <input
            type="text" name="" id="" placeholder='Title of the story' className='title' value={storySettings.title || ""}
            onChange={(e) => setStorySettings(prev => prev.rebuild({title: e.target.value }))}
          />
          <textarea 
            name="" id="Yapping--summary" placeholder='Brainstorm the summary here'
            value={storySettings.summary || ""} onChange={(e) => setStorySettings(prev => prev.rebuild({summary: e.target.value }))}
            >
          </textarea>
      </span>
      {(!gameInfo || gameInfo.creator === userID && Object.keys(gameInfo.players)) &&
        <Button
          variant="contained" color='primary' disableElevation
          onClick={() => setStorySettings(prev => prev.rebuild({ step: "create", topics, chapters: [] }))}
        >
          Start
        </Button>
      }
    </div>
  )
}

export default Onboarding

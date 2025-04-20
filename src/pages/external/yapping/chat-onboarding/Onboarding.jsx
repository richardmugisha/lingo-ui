
import './Onboarding.css'
import { Button } from '@mui/material';

const Onboarding = ({
    storySettings, setStorySettings,
    gameInfo, userID
  }) => {

  
  return (
    <div className='story-onboarding'>
      <h3>You are about to have a chat <br />using these words / expressions found in the topic</h3>
      <div className='side-pool word-pool'>{storySettings.words.map((word, i) => <span key={i}> {word} </span>)}</div>
      <span>
          <input
            type="text" name="" id="" placeholder='Title of the conversation' className='title' value={storySettings.title || ""}
            onChange={(e) => setStorySettings(prev => prev.rebuild({title: e.target.value }))}
          />
          <textarea 
            name="" id="Yapping--summary" placeholder='Draft an overview to guide the conversation'
            value={storySettings.summary || ""} onChange={(e) => setStorySettings(prev => prev.rebuild({summary: e.target.value }))}
            >
          </textarea>
      </span>
      {(!gameInfo || gameInfo.creator === userID && Object.keys(gameInfo.players)) &&
        <Button
          variant="contained" color='primary' disableElevation
          onClick={() => setStorySettings(prev => prev.rebuild({ step: "create" }))}
        >
          Start
        </Button>
      }
    </div>
  )
}

export default Onboarding
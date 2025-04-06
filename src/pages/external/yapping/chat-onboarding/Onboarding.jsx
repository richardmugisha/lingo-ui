
import './Onboarding.css'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from '@mui/material';

const Onboarding = ({
    storySettings, setStorySettings,
    gameInfo, userID
  }) => {
  return (
    <div className='story-onboarding'>
      <h3>You are about to have a chat <br />using these words / expressions found in the deck</h3>
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

/* <section>
    <span className='ai-assistant' onClick={() => setAiOptionsDisplay(!aiOptionsDisplay)}>
      <AutoAwesomeIcon />
      {aiHelp ? aiHelp : 'Get Ai assistance'}
    </span>
    {aiOptionsDisplay && (
      <section>
        <div>
          <span className='summary' onClick={() => { setAiHelp('Ai co-editor'); setAiOptionsDisplay(false); }}>
            Ai co-editor
          </span>
          <p>This will take turns with you in writing sentences for your story</p>
        </div>
        <div>
          <span className='summary' onClick={() => { setAiHelp('Ai for you'); setAiOptionsDisplay(false); }}>
            Ai for you
          </span>
          <p>This will take over the generation of the entire story for you</p>
        </div>
      </section>
    )}
  </section> */
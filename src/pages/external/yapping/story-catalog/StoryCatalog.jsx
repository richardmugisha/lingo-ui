
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material';

const StoryCatalog = ({ stories, setActivity, setTitle, setStory, selected, setSelected }) => {
  return (
    <div className='side side-wide'>
        <div>
          <p>Pick a story to practice with</p> <br />
        </div>
        <div className='side-pool titles'>
            {stories.map((story, i) => (
                <span
                    key={story.title + i}
                    onClick={() => {
                        setSelected(i);
                    }}
                    className={`story--span ${selected === story.title ? 'selected' : ''}`}
                >
                {story.title}
                </span>
            ))}
        </div>
        {
          <>
            <br />
            or 
            <br /><br />
            <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
                onClick={() => {
                    setActivity('onboarding');
                    setTitle('');
                    setStory('');
                }}
            >
                New story
            </Button>
          </>
        }
      </div>
  )
}

export default StoryCatalog

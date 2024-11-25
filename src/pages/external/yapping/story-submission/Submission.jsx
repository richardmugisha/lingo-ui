
import "./Submission.css"
import { Button } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Submission = ({title, setTitle, story, checked, setChecked, handleSubmit}) => {
  const existingTitle = title
  return (
    <div className="submission">
      <h3><AutoAwesomeIcon />Final touches</h3>
      <>
        {
            existingTitle ?
            <h3>Title: {existingTitle}</h3> :
            <span>
              <label htmlFor="">Complete the title</label>
              <input
                  type="text" name="" id="" placeholder='Title of the story' className='title'
                  onChange={(e) => setTitle(e.target.value)}
              />
            </span>
        }
      </>
      <span>
        <label htmlFor="incognito" onClick={() => setChecked(!checked)}>
          <input onChange={() => {}} className='checkbox' value={checked} type="checkbox" name="incognito" id="incognito"
          />
          &nbsp;incognito
        </label>
        <span tooltip='nothing'> &#9432;</span>
      </span>
      <h4>Your story</h4>
      <p id="text-container">
        {story.map(sentenceObj => sentenceObj.sentence).join(' ')}
      </p>
      <Button
        className="submission--btn"
        variant="contained" color='primary' disableElevation
        onClick={handleSubmit}
      >
        Submit Story
      </Button>
    </div>
  )
}

export default Submission

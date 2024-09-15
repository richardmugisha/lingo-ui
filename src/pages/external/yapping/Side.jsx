import React from 'react'

const Side = ({ stories, setWords, words, setSelected, setActivity, activity, setTitle, setStory, selected }) => {
  
  return (
    <div className="words">
        <h1>Story time</h1>
        <p>{activity === 'reading' ? 'Already existing stories' : 'Remove the word you are done using by clicking on it!'}</p> <br />
        { !(selected >= 0) ? (
          <div className='titles'>
            {stories.map((story, i) => (
              <span
                key={story.title + i}
                onClick={() => {
                  setSelected(i);
                }}
                className={`${selected === story.title ? 'selected' : ''}`}
              >
                {story.title}
              </span>
            ))}
          </div>
        ) : (
          <div className='word-pool'>
            {words.map((word, i) => (
              <span onClick={() => setWords(words.filter((w, index) => index !== i))} key={i}>
                {word}
              </span>
            ))}
          </div>
        )}
        <br />
        {/* <input
          type="submit"
          value={`${activity === 'reading' ? 'Create your story' : 'Read instead'}`}
          className='submit custom-button-1'
          onClick={() => {
            setActivity(prev => ['reading', 'creating'].find(acti => acti !== prev));
            setTitle('');
            setStory('');
          }}
        /> */}
      </div>
  )
}

export default Side

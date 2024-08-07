

import React, {useEffect, useState} from 'react';
import './Yapping.css'
import axios from 'axios';

const Yapping = () => {
  const [words, setWords] = useState(() => {
    const temp = []
    JSON.parse(localStorage.getItem('deck')).map(card => card.variations.map(variation => temp.push(variation.variationWord) ) );
    console.log(temp)
    return temp
  })

  const [story, setStory] = useState('')
  const [stories, setStories] = useState([])
  const [title, setTitle] = useState('')
  const [checked, setChecked] = useState(false)
  const [activity, setActivity] = useState('reading') //reading or creating
  const [selected, setSelected] = useState('')

  const [userId ] = useState(JSON.parse(localStorage.getItem('user')).userId)
  const [deckId ] = useState(localStorage.getItem('deckId'))

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = () => {
    console.log(deckId)
    axios.post(`${baseUrl}/api/v1/cards/story-time/${deckId}`, { userId : !checked ? userId : null, story, title})
        .then(res => {
          const { story } = res.data;
          console.log(story)
        })
        .catch(e => console.log(e.msg))
  }

  useEffect(() => {
    axios.get(`${baseUrl}/api/v1/cards/story-time/${deckId}`)
          .then(res => {
            const { stories } = res.data;
            console.log(stories)
            if (stories && stories.length) {setStories(stories); setTitle(stories[0].title); setStory(stories[0].story); setSelected(stories[0].title)}
            else setActivity('creating')
          })
          .catch(e => console.log(e.msg))
  }, [])

  useEffect(() => {
    if (selected) {
      const current = stories.find(story => story.title === selected)
      setTitle(current.title); setStory(current.story)
    }
  }, [selected])
  
  return (
    
    <div className='Yapping'>
      <div className="words">
        <h1>Story time</h1>
        <p>{activity === 'reading' ? 'Already existing stories' : 'Remove the word you are done using by clicking on it!'}</p> <br />
        { activity === 'reading' ? 
          <div className='titles'> {stories.map(story => <span onClick={() => {console.log(story.title, selected); setSelected(story.title)} } className={`${selected === story.title ? 'selected' : ''}`}>{story.title}</span>) } </div> :
          <div className='word-pool'>
            { words.map((word, i) => <span onClick={() => setWords(words => words.filter((w, index) => index !== i))} key={i}>{word}</span>) }
          </div>
        }
        <br />
        <input type="submit" value={`${activity === 'reading' ? "Create your story": "Read stories"}`} className='submit custom-button-1' onClick={() => {setActivity(() => activity ==='creating' ? "reading" : "creating"); setTitle(''); setStory('')}}/>
      </div>
      <div className="story">
        {activity === 'creating' &&
        <div>
          <p>Create a story using the words / expressions </p> 
          <div>
            <label htmlFor="incognito" onClick={() => setChecked(prev => !prev)}><input onChange={() => {}} className='checkbox' value={checked} type="checkbox" name="incognito" id="incognito" /> incognito</label>
            <span tooltip ='nothing'>&#9432;</span>
            <input type="submit" value="Submit" className='submit' onClick={handleSubmit}/>
          </div>
        </div>}
        
        <input type="text" name="" id="" placeholder='Title of the story' className='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea name="" id="" value={story} onChange={(e) => setStory(e.target.value)} onKeyDown={(e) => {if (e.key === 'Tab') { e.preventDefault() ; setStory(prev => prev + '    ')} } }></textarea>
      </div>
    </div>
  )
}

export default Yapping

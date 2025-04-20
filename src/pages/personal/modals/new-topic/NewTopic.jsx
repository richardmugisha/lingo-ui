import React, { useEffect, useState } from 'react';
import './NewTopic.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { chooseTopic } from '../../../../features/personal/topic/topicSlice'
import {fetchSuggestions, saveTopics} from '../../../../api/http';


import { LanguageSelect } from '../../../filters/Filters';

export default () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()

  const [value, setValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({label: '', value: ''});
  const topic = useSelector(state => state.topic)
  const [suggestions, setSuggestiongs] = useState([])
  const [topics, setTopics] = useState([])
  const topicChain = searchParams.get("topics")

  useEffect(() => {
    const newTopic = localStorage.getItem('new-topic--to-create')
    if (!newTopic) return
    const { name, language, langLabel } = JSON.parse(newTopic)
    if (!name) return
    setValue(name); dispatch(chooseTopic({_id: '', name})); setSelectedLanguage({value: language, label: langLabel})

  }, [])

  useEffect(() =>
    { 
      if (!value || !selectedLanguage.value) return
      setTopics(prev => [...prev, value])
      dispatch(chooseTopic({_id: '', name: value, language: selectedLanguage.value}))
      setSelectedLanguage({label: '', value: ''})
      localStorage.setItem('new-topic--to-create', JSON.stringify({ name: value, language: selectedLanguage.value, langLabel: selectedLanguage.label }))
    }, 
    [selectedLanguage, value])


  const showAlert = () => {
    document.getElementsByClassName('topic--alert')[0].classList.remove('topic--hide')
    const timerId = setTimeout(() => {
      document.getElementsByClassName('topic--alert')[0].classList.add('topic--hide')
    }, 3000);
    return () => clearTimeout(timerId)
  }
  // const handle = (from) => {
  //   return !(value && selectedLanguage.value) ? showAlert() : 
  //           navigate(from)
  // }

  useEffect(() => {
    console.log(topicChain, topic.name, topic.subTopics?.map(topic => topic.name))
    fetchSuggestions(topicChain, topic.name, null, "topics", topic.subTopics?.map(topic => topic.name))
      .then(setSuggestiongs)
  }, [topic.name])

  const handleLikes = () => {
      setTopics(prev => [...prev, suggestions[0]])
      setSuggestiongs(prev => prev.slice(1))
    }
  const handleDislikes = () => setSuggestiongs(prev => prev.slice(1))

  const handleSubmitTopics = () => {
    //parent, language, creator, topics
    console.log('clicked')
    saveTopics(topic._id, selectedLanguage.value || "english", topics)
      .then(data => console.log("success"))
      .catch(e => console.log(e))
  }
  
  return (
    <div className='new-topic-page'>
      <h1>Provide a descriptive topic name</h1>
      <input type="topic-name" placeholder='Topic name' autoFocus value={value} onChange={(e) => {setValue(e.target.value); /*dispatch(openTopic({_id: '', topicName: e.target.value}))*/}}/>
      <div className='select-container'>
        <label htmlFor="topic language">Cards language</label>
        <LanguageSelect selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <p className='topic--alert topic--hide'>Please provide topic name and language !</p>
      
      {
        suggestions?.length > 0 && 
        <div>
          <p>Or</p><br />
          <p>select from these suggestions</p><br />
          <p>{suggestions[0]?.replaceAll("_", " ")}</p><br />
          <div>
            <button onClick={handleDislikes}>👎</button>
            <button onClick={handleLikes}>👍</button>
          </div>
        </div>
      }
      {
        topics.length > 0 &&
        <ul>
          {topics.map((topic, index) => <li key={index}>{topic?.replaceAll("_", " ")}</li>)}
        </ul>
      }
      {/* <div className="custom-button-1" onClick={() => handle('../adding/manual')}>Create cards manually</div>
      <div className="custom-button-1" onClick={() =>  handle('../adding/auto')}>generate cards with AI</div> */}
      <button className='custom-button-1' onClick={handleSubmitTopics}>Save the topics</button>
      
    </div>
  )
}

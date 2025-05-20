import React, { useCallback, useEffect, useState, useRef } from 'react';
import Spinner from 'react-spinner-material';
import './Personal.css';
import Filters from '../filters/Filters';
import { useSelector, useDispatch } from 'react-redux';
import { chooseTopic, storeSubTopics, removeTopics, storeStories, storeScripts } from '../../features/personal/topic/topicSlice';
import { updateLearning } from './modals/guided-learning/utils/useLearning';
import { Button } from '@mui/material';
import { Delete as DeleteIcon, FilterAlt as FilterIcon, Clear as Close } from '@mui/icons-material';
import { MuiCheckbox } from '../../components/MuiComponents';
import WordCard from '../../components/word/Card';
import TopicCard from '../../components/topic/Card'
import FypManager from './modals/fyp/Manager';
import Info from '../../components/Info';
import Notice from "../../components/notice/Notice"

import { useNavigate, Link } from 'react-router-dom';
import { fetchManyTopics, deleteTopics, apiBatchRequest, getWords, fetchAllStories } from '../../api/http'

export default ({ page }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { subTopics, words, _id: topicID, learning, stories, scripts } = useSelector((state) => state.topic || {});
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [checked, setChecked] = useState(false);
  const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState({ label: '', value: '' });
  const [info, setInfo] = useState({ type: '', message: '', exists: false });
  const [useFilters, setUseFilters] = useState(false)
  const batchReqRef = useRef(0)
  const [topicChain, setTopicChain] = useState([])

  const [userLearning, setUserLearning] = useState({})

  useEffect(() => {
    error && setInfo({ type: 'danger', message: error, exists: true });
  }, [error]);


  const apiBatchRequestHandle = useCallback( async(requests) => {
        try {
          const data = await apiBatchRequest(requests)
          const { toAdd, toWish } = data.successRequests; 
          if (toAdd) localStorage.removeItem('toAdd')
          if (toWish) localStorage.removeItem('toWish')
        } catch (error) {
          setError(error.message)
        }
  }, [])

  useEffect(() => {
    localStorage.removeItem('new-topic--to-create')
    const toAdd = JSON.parse(localStorage.getItem('toAdd'))
    const toWish = JSON.parse(localStorage.getItem('toWish'))
    const requests = []
    if (toAdd) requests.push({ route: 'toAdd', body: Object.entries(toAdd).map(([k, v]) => ({id: v.id ? k : '', name: k, words: v.words, language: v.language, userId})) } )
    if (toWish) requests.push({route: 'toWish', body:  Object.entries(toWish).map(([k, v]) => ({id: v.id ? k : '', name: k, words: v.words, language: v.language, userId})) } )
    if (batchReqRef.current === 0 && requests.length) { apiBatchRequestHandle(requests); batchReqRef.current = 1 }
    
  }, [])

  const getSubTopics = useCallback(async (parent, myLearning) => {
    try {
      const data = await fetchManyTopics(userId, myCardsOnly, selectedLanguage.value, parent, myLearning);
      if (!data?.length) setMyCardsOnly(false)
      return data;
    } catch (error) {
      throw error;
    } finally {
      dispatch(chooseTopic({ learning: {}}))
      setSearching(false)
    }
  }, [myCardsOnly, selectedLanguage.value])

  useEffect(() => {
    getSubTopics(null)
      .then(({ topics }) => {
          if (topics) dispatch(storeSubTopics(topics))
      })
      .catch(error => setError(error.message))
  }, [myCardsOnly, selectedLanguage]);

  const onTopicClickHandle = async (topic, topicHistory = topicChain) => {
    if (page === "my-learning") {
      dispatch(chooseTopic(topic))
      return navigate(`../learning`)
    }
    setPersonalSelectedItem([]);
    if (!page) navigate("topics")
    dispatch(chooseTopic(topic))
    setSearching(true)
    // navigate(`options/?topic=${topic._id}`)
    getSubTopics(topic?._id)
      .then(({ topics }) => {
        setTopicChain(topic ? [...topicHistory, topic] : [])
        dispatch(dispatch(storeSubTopics(topics)))
      })
      .catch(error => setError(error.message))
      .finally(() => setSearching(false))

    fetchAllStories(topic._id, "story")
      .then( stories => dispatch(storeStories(stories)))

    fetchAllStories(topic._id, "chat")
      .then( scripts => dispatch(storeScripts(scripts)))
  };

  const deletingTopics = async () => {
    try {
      const data = await deleteTopics(personalSelectedItem)
      dispatch(removeTopics(personalSelectedItem));
      setPersonalSelectedItem([]);
      setInfo({ type: 'info', message: data.msg, exists: true } );
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!info.exists) return;
    const timeout = setTimeout(() => {
      setInfo({exists: false});
    }, 5000);
    return () => clearTimeout(timeout);
  }, [info]);

  useEffect(() => {
    console.log('wwjfdlkfjkldj', words, page)
    if (["", "topics", "my-learning",].includes(page)) {
      setTopicChain([])
      dispatch(chooseTopic({words: [], stories: [], scripts: []}))
      getSubTopics(null, page)
      .then(({ topics }) => {
          if (page === "my-learning") console.log(topics)
          if (topics) dispatch(storeSubTopics(topics))
      })
      .catch(error => setError(error.message))
    }
    else if (page !== "topics" && words.length) {
      console.log('jjlkjijij')
      setSearching(true)
      console.log("happening")
      const wordIDs = words.map(word => typeof word === "string" ? word : word?._id);
      getWords("english", wordIDs)
      .then(data => {
        dispatch(chooseTopic({words: data.words || []}))
        setSearching(false)
        if (["chats", "stories", "live-chat"].includes(page)) {
          setSearching(true)
          updateLearning(dispatch, topicID, data.words)
            .then(() => {
                console.log('why not ---------')
                setSearching(false)
                if (page === "stories") navigate(`../../more/story-time/?topic=${topicID}`)
                else if (page === "chats") navigate(`../../more/chat-time/?topic=${topicID}`)
                else if (page === "live-chat") navigate(`../../more/live-chat/?topic=${topicID}`)
            })
            .catch((e) => setError(e.message))
            .finally(() => setSearching(false))
        }
        else if (page === "learning") {
          navigate(`../guided-learning?topic=${topicID}`)
        }
      })
    }


  }, [page])

  const topicDisplay = (name) => {
    return name.replaceAll("_", " ").split(" ").map(subName => subName.slice(0, 5)).join(" ") + " / "
  }

  const handleTopicNavigation = (topic, index) => {
    dispatch(chooseTopic({words: [], stories: [], scripts: []}))
    onTopicClickHandle(topic, topicChain.slice(0, index))
  }

  console.log(subTopics)

  return (
    <div className="personal">
        {!personalSelectedItem.length ? (
          <div className="personal--filters">
            <span className="filter-btn" onClick={() => setUseFilters(!useFilters)}>{useFilters ? <Close /> : <FilterIcon />} Filters</span>
            <Filters 
                useFilters={useFilters} myCardsOnly={myCardsOnly} selectedLanguage={selectedLanguage} 
                setMyCardsOnly={setMyCardsOnly} setSelectedLanguage={setSelectedLanguage} page={page} 
                words={words} topicChain={topicChain} stories={stories?.length || 0} scripts={scripts?.length || 0}
            />
          </div>
        ) : (
          <div className="personal--deleting-panel">
            <MuiCheckbox
              label={`${checked ? 'Unselect All' : 'Select All'}`} checkedValue={checked}
              callback={() => {
                setChecked(!checked);
                setPersonalSelectedItem(checked ? [] : subTopics.filter(topic => topic.creator === userId).map(topic => topic._id));
              }}
            />
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={deletingTopics}> Delete </Button>
          </div>
        )}

        <div className="head">
          <div className="shelf">Your {page} 
            {page !== "fyp" && 
            <div style={{ maxWidth: "400px"}} className='topic-chain'>
                <button onClick={e => handleTopicNavigation()}>--/</button>
                {topicChain.map((topic, index) => <button key={index} onClick={() => handleTopicNavigation(topic, index)}>{topicDisplay(topic.name)}</button>)}
            </div>}
          </div>
          <div>
            { words?.length > 0 && ["words", "topics"].includes(page) && <Link className='option' to="../live-chat">🎤Live Chat</Link>}
            { words?.length > 0 && ["words", "topics"].includes(page) && <Link className='option' to="../learning">▶️Learning</Link>}
            {["topics", ""].includes(page)  && <Link className='option' to={`../new-topic/?topics=${topicChain.map(topic => topic.name).join(" > ")}`} >New {topicChain.length ? "sub topic" : "Topic"}</Link>}
            {
                ["words"].includes(page) && topicChain.length > 0 && <>
                <Link className='option' to={`../adding/?topic=${topicID}&&topics=${topicChain.map(topic => topic.name).join(" > ")}`}>populate</Link>
              </>
            }
          </div>
        </div>

        {info.exists && <Info info={info} />}

        <div className="body">
          {searching && <Spinner radius={120} color="#345C70" stroke={2} visible={true} />}

          {(subTopics?.length && ["", "topics", "my-learning"].includes(page))? subTopics.map((topic) => (
              <TopicCard 
                  key={topic._id}
                  topic={topic} userId={userId} 
                  onClick={() => topic.creator === userId &&
                    setPersonalSelectedItem(personalSelectedItem.includes(topic._id)
                      ? personalSelectedItem.filter((topicID) => topicID !== topic._id)
                      : [...personalSelectedItem, topic._id]
                    )
                  }
                  onDoubleClick={() => onTopicClickHandle(topic)}
                  style={{ backgroundColor: personalSelectedItem.includes(topic._id) ? '#2225' : '#C0D7DA' }}
              />
            )) :
            page === "words" && words?.length ? words.map((wObj, index) => <WordCard key={index} wObj={wObj} /> ) :
            page === "fyp" ?
            <FypManager words={words} /> :

            !searching && 
            <Notice 
              page={page} 
              noTopics={!subTopics?.length > 0 && !topicChain?.length > 0} noSubTopics={!subTopics?.length > 0 && topicChain?.length > 0} 
              noWords={!words?.length > 0} noLearning={!learning || !Object.keys(learning).length > 0}
              noMyLearning={!subTopics.find(topic => (topic.learning?.topic ))}
            />
            // <p>This topic doesn't have {page === "topics" ? "topics" : "words"} yet! Populate it!</p>
          }
        </div>
      
    </div>
  );
};

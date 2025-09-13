import React, { useEffect, useState } from 'react';
import './CardAddManual.css';
import AxiosWrapper from '../../../../api/http/AxiosWrapper';
import Spinner from 'react-spinner-material';

import { useSelector, useDispatch } from 'react-redux';
import { push } from '../../../../features/personal/topic/topicSlice';
import { useNavigate } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';
import { httpEndpoint } from '../../../../../serverConfig';

import handleBlanksGen from '../../../external/yapping/utils/handleBlanks';

const CardAddManual = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleRefresh = usePageRefreshHandle()

  const [userId ] = useState(JSON.parse(localStorage.getItem('user')).userId)

  // const { _id: topicId, topicName } = useSelector(state => state.topic.topic)

  // useEffect(() => {
  //   handleRefresh(topicId)
  // }, [topicId])  

  const retrieveTopic = () => {
        if (topic?.name) return
        if (handleRefresh()) return
        const newTopic = localStorage.getItem('new-topic--to-create')
        if (!newTopic) return {}
        const { name, language } = JSON.parse(newTopic);
        return {_id: '', language, name}
    }
  
  const topic = useSelector(state => state.topic)

  useEffect(() => {
    retrieveTopic()
  }, [])

  const [status, setStatus] = useState('preSubmit');
  const [readytosubmit, setReadytosubmit] = useState(false);
  const formTemplate = {
    types: ["noun", "verb", "adverb", "adjective", 'phrasal verb', "proverb", "idiom"],
    languageStyles: ['formal', 'informal', 'colloquial', 'slang', 'jargon'],
  }
  const [ formContent, setFormContent ] = useState({})

  const [errorMsg, setErrorMsg] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checkAllFilled()) return
    submitting()
  }

  useEffect(() => {
    let delay;
    if (['error', 'submitted'].includes(status)) {
      delay = setTimeout(() => {
        setStatus('preSubmit');
      }, 5000);
    }
    return () => clearTimeout(delay);
  }, [status])

  const submitting = () => {
    if (status === 'submitting') return
    setStatus('submitting');
    postingData(`${ httpEndpoint }/words/create-new-word/${topic._id}`, { language: topic.language, ...formContent} )
      .then((data) => {
        setFormContent({})
        console.log(data.word._id)
      })
      .catch(e => {
        console.log(e.message)
        setStatus('error'); setErrorMsg("Oops... Couldn't submit your card! Try again")})
  }

  const postingData = async(url, requestBody) => {
      try {
        const response = await AxiosWrapper.post(url, requestBody);
        setStatus('submitted');
        return response.data;
      } catch (err) {
        const {error, topic} = err.response.data
        //console.log(topic?._id)
        if (topic?.id) dispatch(id(topic.id))
        setStatus('error');
        throw new Error(`Error making POST REQUEST in manual card: ${error}`)
      }
  }

  useEffect(() => {
    if (!formContent.example) return
    setFormContent({...formContent, blanked: handleBlanksGen(formContent.example, [formContent.word])?.blanked } )
  }, [formContent.example])

  const checkAllFilled = () => {
    if (formContent.meaning && formContent.languageStyle && formContent.example && formContent.synonym && formContent.antonym) return true;
    setStatus('error');
    setErrorMsg('Fill the blanks first!'); 
    return false
  }

  
  return (
    <div className='card-add-manual'>
      <form action="" onSubmit={handleSubmit}>
          <section className="buttons">
            <label htmlFor="" style={{display: 'flex', color: status === 'error' ? '#b32525' : '#6cb00c'}}>
              { status === 'error' && <>{errorMsg}</> } {/*☹ try again!*/}
              { status === 'submitting' && <><Spinner radius={20} color={"#b0b0ff"} stroke={2} visible={true} />submitting </> }
              { status === 'submitted' && '✅submitted'}
            </label>
            <input type="submit"/>
            <button onClick={() => navigate('../card/add/auto')}>Generate with AI</button>
          </section>
          <hr />
          <section>
            <div>
                <label htmlFor="">Pick the type of word</label>
                <div className='labels'>
                  {formTemplate.types.map((type, i) => <label key={i} style={{color: type == formContent.type ? 'red': 'black'}} onClick={() => setFormContent({...formContent, type})}>{type}</label>)}
                </div>  
            </div>
          </section>
          <hr />
          <hr />
          <section className='variation'>
            {formContent.type && 
            <div>
                <label htmlFor="">The {formContent.type}</label>
                <input type="text" value={formContent.word} placeholder={`enter the ${formContent.type}`} onChange={e => setFormContent({...formContent, word: e.target.value})}/>
            </div>}

            <div>
                <label htmlFor="">meaning</label>
                <input type="text" value={formContent.meaning} placeholder="enter the meaning" onChange={e => setFormContent({...formContent, meaning: e.target.value})}/>
            </div>

            <div>
                <label htmlFor="">Select the language style</label>
                <div className='labels'>
                  {formTemplate.languageStyles.map((style, i) => <label key={i} style={{color: style == formContent.languageStyle ? 'red': 'black'}} onClick={() => {setFormContent({...formContent, languageStyle: style})}}>{style}</label>)}
                </div>
            </div>

            <div>
                <label htmlFor="">example</label>
                <input className = "" type="text" placeholder="example" value={formContent.example} onChange={e => setFormContent({...formContent, example: e.target.value})}/>
            </div>

            <div>
                <label htmlFor="">synonym</label>
                <input className = "" type="text" value={formContent.synonym} placeholder="synonym" onChange={e => setFormContent({...formContent, synonym: e.target.value})}/>
            </div>

            <div>
                <label htmlFor="">antonym</label>
                <input className = "" type="text" value={formContent.antonym} placeholder="antonym" onChange={e => setFormContent({...formContent, antonym: e.target.value})}/>
            </div>
          </section>
      </form>
    
    </div>
  )
}

export default CardAddManual


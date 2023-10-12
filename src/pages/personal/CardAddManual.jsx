import React, { useEffect, useState } from 'react';
import './CardAddManual.css';
import axios from 'axios';
import Spinner from 'react-spinner-material';

const CardAddManual = ({ baseUrl, setModal, deckName, setModalSelect, setDeckList}) => {
  const [status, setStatus] = useState('preSubmit');
  const [readytosubmit, setReadytosubmit] = useState(false);
  const formTemplate = {
    cardType: '', cardWord: '', meaning: [], synonym: [], antonym: []
  }
  const [ formContent, setFormContent ] = useState(formTemplate)

  const [meaning, setMeaning] = useState(''); // set current value
  const [example, setExample] = useState('');
  const [synonym, setSynonym] = useState('');
  const [antonym, setAntonym] = useState('');
  const [submit, setSubmit] = useState(false)

  const [plusMeaning, setPlusMeaning] = useState(false);
  const [plusSynonym, setPlusSynonym] = useState(false);
  const [plusAntonym, setPlusAntonym] = useState(false);


  const handleSubmit = () => {
    console.log('clicked')
    if (readytosubmit) return submitting()
    if ((synonym || formContent.synonym.length > 0) && (antonym || formContent.antonym.length > 0) && (formContent.meaning.length > 0 || meaning && example) ) {
      setFormContent((prev) => ({ ...prev, synonym: [...prev.synonym, synonym]}))
      setFormContent((prev) => ({ ...prev, antonym: [...prev.antonym, antonym]}))
      setFormContent((prev) => ({ ...prev, meaning: [...prev.meaning, {meaning, example}]}) )
      return setReadytosubmit(true);
    } // we can't submit coz some fields are contentless.

    // if ( Object.values(formContent).every( value => value.length ) ) {
    //   setStatus('submitting'); console.log('sub')
    //   return postingData(`${baseUrl}/api/v1/cards/${deckName}`, { mode: 'manual', content: {formContent}} ).then((data) => console.log(data)).catch(e => console.log(e))
    // }

    setSubmit(true);
    setTimeout(() => {
      setSubmit(false)
    }, 2000)
  }

  const submitting = () => {
    console.log(formContent)
    //const baseUrl = "https://flashcard-api-hy23.onrender.com";
    setStatus('submitting'); console.log('sub')
    postingData(`${baseUrl}/api/v1/cards/${deckName}`, { mode: 'manual', content: formContent} )
      .then((data) => {
        console.log(data); afterSubmitReset(); 
        setDeckList((prev) => [...new Set([...prev, deckName])])
      })
      .catch(e => console.log(e))
  }

  const afterSubmitReset = () => {setFormContent(formTemplate); setReadytosubmit(false); setMeaning(''); setExample(''); setSynonym(''); setAntonym('')};

  useEffect(() => {
    if (!readytosubmit) return
    submitting()
  }, [readytosubmit])

  const postingData = async(url, requestBody) => {
      try {
        const response = await axios.post(url, requestBody);
        setStatus('submitted');
        return response.data;
      } catch (error) {
        setStatus('error');
        throw new Error(`Error making POST REQUEST in manual card: ${error.message}`)
      }
  }

  const handlePlusClickMeaning = () => { 
    if (meaning && example) {setMeaning('added'); setExample('added')};
    
    setPlusMeaning(true); setTimeout(() => {
      setPlusMeaning(false); setMeaning(''); setExample('')
    }, 2000);
  }
  const handlePlusClickSynonym = () => {
    if (synonym) setSynonym('added')
    setPlusSynonym(true); setTimeout(() => {
      setPlusSynonym(false); setSynonym('')
    }, 2000);
  }
  const handlePlusClickAntonym = () => {
    if (antonym) setAntonym('added')
    setPlusAntonym(true); setTimeout(() => {
      setPlusAntonym(false); setAntonym('')
    }, 2000);
  }
  return (
    <div className='card-add-manual'>
      <div className="buttons">
        { status === 'preSubmit' && <div onClick={handleSubmit}>submit</div>}
        { status === 'error' && <div onClick={handleSubmit}>☹ try again!</div>}
        { status === 'submitting' && <div style={{ display: 'flex'}}><Spinner radius={20} color={"#b0b0ff"} stroke={2} visible={true} />  submitting</div> }
        { status === 'submitted' && <div>✅submitted !</div>}
        <div onClick={() => setModalSelect('card-add-auto')}>automate</div>
      </div>
      <form action="">
          <div>
              <label htmlFor="">card type</label>
              <input className={submit && !formContent.cardType ? 'alertEmpty': null} type="text" placeholder="noun, verb, idiom, adjective..." value={formContent.cardType} autoFocus onChange={e => {setStatus('preSubmit'); setFormContent((prev) => ({ ...prev, cardType: e.target.value}))}}/> 
          </div>

          <div>
              <label htmlFor="">card word</label>
              <input className={submit && !formContent.cardWord ? 'alertEmpty': null} type="text" placeholder="fill in with a word or a phrase" value={formContent.cardWord} onChange={e => {setFormContent((prev) => ({ ...prev, cardWord: e.target.value}))}} />
          </div>

          <div>
              <label htmlFor="">meaning</label>
              <input className={(submit || plusMeaning) && !meaning ? 'alertEmpty': null} type="text" value={meaning} placeholder="fill the example section too" onChange={e => setMeaning(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickMeaning(); if (meaning && example) {setFormContent((prev) => ({ ...prev, meaning: [...prev.meaning, {meaning, example}]}) )}}}>+</span>
          </div>

          <div>
              <label htmlFor="">example</label>
              <input className={(submit || plusMeaning) && !example ? 'alertEmpty': null} type="text" placeholder="example" value={example} onChange={e => setExample(e.target.value)}/>
          </div>

          <div>
              <label htmlFor="">synonym</label>
              <input className={(submit || plusSynonym) && !synonym ? 'alertEmpty': null} type="text" value={synonym} placeholder="synonym" onChange={e => setSynonym(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickSynonym(); if (synonym) { setFormContent((prev) => ({ ...prev, synonym: [...prev.synonym, synonym]}))}}}>+</span> 
          </div>

          <div>
              <label htmlFor="">antonym</label>
              <input className={(submit || plusAntonym) && !antonym ? 'alertEmpty': null} type="text" value={antonym} placeholder="antonym" onChange={e => setAntonym(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickAntonym(); if (antonym) { setFormContent((prev) => ({ ...prev, antonym: [...prev.antonym, antonym]}))}}} >+</span>  
          </div>
      </form>
    
    </div>
  )
}

export default CardAddManual


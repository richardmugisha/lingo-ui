import React, { useEffect, useState } from 'react';
import './CardAddManual.css';
import axios from 'axios'

const CardAddManual = ({setModal, deckName, setModalSelect}) => {
  const [ formContent, setFormContent ] = useState({
    cardType: '', cardWord: '', meaning: [], synonym: [], antonym: []
  })

  const [meaning, setMeaning] = useState(''); // set current value
  const [example, setExample] = useState('');
  const [synonym, setSynonym] = useState('');
  const [antonym, setAntonym] = useState('');
  const [submit, setSubmit] = useState(false)

  const [plusMeaning, setPlusMeaning] = useState(false);
  const [plusSynonym, setPlusSynonym] = useState(false);
  const [plusAntonym, setPlusAntonym] = useState(false);


  const handleSubmit = () => {
    if ( Object.values(formContent).every( value => value.length ) ) {
      return postingData(`http://localhost:5000/api/v1/cards/${deckName}`, { mode: 'manual', content: {formContent}} ).then((data) => console.log(data)).catch(e => console.log(e))
    }
    setSubmit(true);
    setTimeout(() => {
      setSubmit(false)
    }, 2000)
  }

  const postingData = async(url, requestBody) => {
      try {
        const response = await axios.post(url, requestBody)
        return response.data;
      } catch (error) {
        throw new Error(`Error making POST REQUEST in manual card: ${error.message}`)
      }
  }

  const handlePlusClickMeaning = () => { 
    if (meaning && example) {setMeaning('added'); setExample('added')}
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
        <div onClick={handleSubmit}>submit</div>
        <div onClick={() => setModalSelect('card-add-auto')}>automate</div>
      </div>
      <form action="">
          <div>
              <label htmlFor="">card type</label>
              <input className={submit && !formContent.cardType ? 'alertEmpty': null} type="text" placeholder="noun, verb, idiom, adjective..." autoFocus onChange={e => {setFormContent((prev) => ({ ...prev, cardType: e.target.value}))}}/> 
          </div>

          <div>
              <label htmlFor="">card word</label>
              <input className={submit && !formContent.cardWord ? 'alertEmpty': null} type="text" placeholder="fill in with a word or a phrase" onChange={e => {setFormContent((prev) => ({ ...prev, cardWord: e.target.value}))}} />
          </div>

          <div>
              <label htmlFor="">meaning</label>
              <input className={(submit || plusMeaning) && !meaning ? 'alertEmpty': null} type="text" value={meaning} placeholder="fill the example section too" onChange={e => setMeaning(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickMeaning(); if (meaning && example) {setFormContent((prev) => ({ ...prev, meaning: [...prev.meaning, {meaning, example}]}) )}}}>+</span>
          </div>

          <div>
              <label htmlFor="">example</label>
              <input className={(submit || plusMeaning) && !example ? 'alertEmpty': null} type="text" placeholder="" value={example} onChange={e => setExample(e.target.value)}/>
          </div>

          <div>
              <label htmlFor="">synonym</label>
              <input className={(submit || plusSynonym) && !synonym ? 'alertEmpty': null} type="text" value={synonym} placeholder="" onChange={e => setSynonym(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickSynonym(); if (synonym) { setFormContent((prev) => ({ ...prev, synonym: [...prev.synonym, synonym]}))}}}>+</span> 
          </div>

          <div>
              <label htmlFor="">antonym</label>
              <input className={(submit || plusAntonym) && !antonym ? 'alertEmpty': null} type="text" value={antonym} placeholder="" onChange={e => setAntonym(e.target.value)}/>
              <span className='plus' onClick={() => { handlePlusClickAntonym(); if (antonym) { setFormContent((prev) => ({ ...prev, antonym: [...prev.antonym, antonym]}))}}} >+</span>  
          </div>
      </form>
    
    </div>
  )
}

export default CardAddManual


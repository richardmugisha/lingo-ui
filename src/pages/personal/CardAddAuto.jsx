import React, {useRef, useState} from 'react';
import axios from 'axios';
import './CardAddAuto.css';
import Spinner from 'react-spinner-material';

const CardAddAuto = ({ baseUrl, deckName, setDeckList }) => {
    const [status, setStatus] = useState('preSubmit');
    const textRef = useRef(null);
    console.log(deckName)

    const handleSubmit = () => {
      // const baseUrl = "http://localhost:3500"//https://flashcard-api-hy23.onrender.com";
      const text = textRef.current.value;
      setStatus('submitting')
      console.log(text)
      return postingData(`${baseUrl}/api/v1/cards/${deckName}`, { mode: 'auto', content : text}).then((data) => console.log(data)).catch(e => console.log(e))
    }

    const postingData = async(url, requestBody) => {
      try {
        const response = await axios.post(url, requestBody);
        setStatus('submitted');
        setDeckList((prev) => [...new Set([...prev, deckName])])
        return response.data;
      } catch (error) {
        setStatus('error');
        throw new Error(`Error making POST REQUEST in auto card: ${error.message}`)
      }
  }

    const placeholder = "Follow the format!!!\nWrite your words or phrases and strictly separate them with commas.\n e.g: innocent, in spite of, dedicated, although.\n This section uses GPT to generate the meanings, examples, synonyms... for you. Always cross-check !!!"
  return (
    <div className='card-add-auto'>
      <div className='words'>words</div>
      { status === 'preSubmit' && <div className='submit' onClick={handleSubmit}>submit</div>}
      { status === 'error' && <div className='submit' onClick={handleSubmit}>☹ try again!</div>}
      { status === 'submitting' && <div className='submit' style={{ display: 'flex'}}><Spinner radius={20} color={"#b0b0ff"} stroke={2} visible={true} />  submitting</div> }
      { status === 'submitted' && <div className='submit'>✅submitted !</div>}
      <div className='text'>
        <textarea name="" id="" cols="30" rows="10" autoFocus placeholder={placeholder} ref={textRef}></textarea>
      </div>
    </div>
  )
}

export default CardAddAuto

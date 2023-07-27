import React, {useRef} from 'react';
import axios from 'axios';
import './CardAddAuto.css';

const CardAddAuto = ({ deckName }) => {
    const textRef = useRef(null);
    console.log(deckName)
    const handleSubmit = () => {
      const text = textRef.current.value;
      console.log(text)
      return postingData(`http://localhost:5000/api/v1/cards/${deckName}`, { mode: 'auto', content : text}).then((data) => console.log(data)).catch(e => console.log(e))
    }

    const postingData = async(url, requestBody) => {
      try {
        const response = await axios.post(url, requestBody)
        return response.data;
      } catch (error) {
        throw new Error(`Error making POST REQUEST in auto card: ${error.message}`)
      }
  }

    const placeholder = "Follow the format!!!\nWrite your words or phrases and strictly separate them with commas.\n e.g: innocent, in spite of, dedicated, although.\n This section uses GPT to generate the meanings, examples, synonyms... for you. Always cross-check !!!"
  return (
    <div className='card-add-auto'>
      <div className='words'>words</div>
      <div className='submit' onClick={handleSubmit}>submit</div>
      <div className='text'>
        <textarea name="" id="" cols="30" rows="10" autoFocus placeholder={placeholder} ref={textRef}></textarea>
      </div>
    </div>
  )
}

export default CardAddAuto

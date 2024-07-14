import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import './CardAddAuto.css';
import ProgressBar from "@ramonak/react-progress-bar";

const CardAddAuto = ({ deckName, setDeckList }) => {
  const [userId ] = useState(JSON.parse(localStorage.getItem('user')).userId)
  const [deckId, setDeckId] = useState(localStorage.getItem('deckId'))
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [status, setStatus] = useState('preSubmit');
    const [progress, setProgress] = useState(0)
    const [unprocessed, setUnprocessed] = useState([]);
    const [timePerCard, setTimePerCard] = useState(2000) // milliseconds
    const textRef = useRef(null);

    useEffect(() => {
      let delay;
      if (['submitted', 'error'].includes(status)) {
        delay = setTimeout(() => {
          setStatus('preSubmit')
        }, 3000);
      }
      return () => clearTimeout(delay)
    }, [status])

    const handleSubmit = (e) => {
      e.preventDefault()
      if (status === 'submitting') return
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const text = textRef.current.value;
      if (!text) return
      console.log(text.split(','))
      setUnprocessed(text.split(','))
      console.log(text)
      return postingData(`${baseUrl}/api/v1/cards/${deckName}`, { userId, deckId, mode: 'auto', content : text}).then((data) => console.log(data)).catch(e => console.log(e))
    }

    useEffect(() => {
      let interval;
      if (status === 'submitting') {
        const totalTime = unprocessed.length * timePerCard // number of milliseconds
        console.log(totalTime)
        const intervalDelay = 1000
        const step = intervalDelay * 100 / totalTime
        interval = setInterval(() => {
          setProgress(prev => prev + step <= 100 ? prev + step : 100)
        }, intervalDelay);
      }
      return () => clearInterval(interval)
    }, [status])

    const postingData = async(url, requestBody) => {
      setProgress(0)
      try {
        axios.get(`${baseUrl}/api/v1/cards/app`)
          .then(res => {
            const {timePerCard:timesPerCard} = res.data;
            console.log(timesPerCard);
            const timePerCard = timesPerCard ? timesPerCard.reduce((acc, curr) => acc + curr, 0) / timesPerCard.length : null
            console.log(timePerCard)
            setTimePerCard((prev) => timePerCard || prev)
            setStatus('submitting')
          })
          .catch(error => {console.log(error.message)})

        const startTime = Date.now(); // Record start time
        const data = (await axios.post(url, requestBody) ).data;
        setDeckId(data.deck._id)
        const elapsedTime = Date.now() - startTime; // Calculate elapsed time
        const processCardLength = unprocessed.length//beforeProcess.length - unprocessed.length;
        axios.patch(`${baseUrl}/api/v1/cards/app`, { timePerCard : elapsedTime / processCardLength }); // Send elapsed time to server
        setStatus('submitted');
        textRef.current.value = ''
        console.log(data)
        setDeckList((prev) => [...prev.filter(deck => deck._id !== data.deck._id), data.deck])
        return data;
      } catch (err) {
        const {error, deck} = err.response.data
        console.log(deck?._id)
        setDeckId(deck?._id)
        setStatus('error');
        throw new Error(`Error making POST REQUEST in auto card: ${error}`)
      }
  }

    const placeholder = "Follow the format!!!\nWrite your words or phrases and strictly separate them with commas.\n e.g: innocent, in spite of, dedicated, although.\n This section uses GPT to generate the meanings, examples, synonyms... for you. Always cross-check !!!"
  return (
    <form action="" className='card-add-auto'>
      <div className='card-add-auto--top'>
        <label htmlFor="deck name" className="deckName">{deckName}</label>
        <div>
          <label htmlFor="status" style={{color: status === 'error' ? 'red' : 'green'}}>{status === 'error' ? '☹ Oops... try again!' : status === 'submitted' ? '✅submitted !': ''}</label>
          <input type='submit' className='submit' onClick={handleSubmit} />
        </div>
      </div>
      {status === 'submitting' && <ProgressBar className='ProgressBar' completed={Math.floor(progress)} bgColor="black" /> }
      <textarea name="" id="" cols="30" rows="10" autoFocus placeholder={placeholder} ref={textRef}></textarea>
    </form>
  )
}

export default CardAddAuto

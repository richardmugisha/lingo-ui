import React, {useRef, useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './SpeechQuiz.css';
import Spinner from 'react-spinner-material';
import shuffledNumbers from '../../utils/shuffleArray';

let prompt = '';
const preFix = 'Hello fam. This quiz consists of giving';
const postFix = 'of the words or expressions I am about to give. Be ready... one, two, go!...';
let cardIndex = 0
let synth, voice = '';
const SpeechQuiz = ({ deck, quizType}) => {
  const order = useRef(null)
  const [card, setCard] = useState(null)
  const [ algoSpeech, setAlgoSpeech ] = useState(null);
  const [goAhead, setGoAhead] = useState(false)
  const fired = useRef(false)

  // long

  if (quizType === 'meaning') {
    prompt = ' the meanings '
  }
  else if (quizType === 'example') {
    prompt = ' examples of usage '
  }
  else if (['synonym', 'antonym'].includes(quizType)) {
    prompt = ` ${quizType}s `
  }

  prompt = preFix + prompt + postFix

  useEffect(() => {
   synth = window.speechSynthesis;
   voice = synth.getVoices()[4] // #4 is the google us english female

  }, [])
  
  const initial_speech = async () => {
    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.voice = voice;
    synth.speak(utterance);
    console.log('starting the speech')
    utterance.onend = () => {setGoAhead(true)}
    
  }

  const recurring_speech = async () => {
    const utterance = new SpeechSynthesisUtterance(algoSpeech);
    utterance.voice = voice;
    synth.speak(utterance);
    utterance.onend = () => {start()} // we start listening to me then.
    //utterance.onend = speaking;
  }

  console.log('woh')

  useEffect(() => {
    if (!deck) return
    // intro speech 
    !fired.current && initial_speech()
    fired.current = true
    order.current = shuffledNumbers(deck.length-1);
    setCard(deck[order.current[cardIndex]])

    return () => synth.cancel
  }, [deck])

  useEffect(() => {
    card && goAhead && setAlgoSpeech(`${cardIndex === 0 ? 'The first one is' : cardIndex === deck.length-1 ? 'and the last one is' : 'The next one is'}... ${card.word}`)
  }, [card, goAhead])


  useEffect( () => {

    algoSpeech && recurring_speech();

    return () => synth.cancel;

   }, [algoSpeech]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    console.log(transcript)
    if (transcript.includes('over to you')) {
        //setMySpeech(transcript.slice(0, -11));
        console.log('fucking transcript')
        stop()
        send()
    }
    if (transcript.includes('clear clear')) resetTranscript()
  }, [transcript])

    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }

  const start = () => {
    console.log('speaking')
    SpeechRecognition.startListening({ continuous: true})
      
  }

  const stop = () => {
    return SpeechRecognition.stopListening();
  }


  const send = () => {
      //SpeechRecognition.stopListening()
      resetTranscript()
      cardIndex += 1
      setCard(deck[order.current[cardIndex]])

      // setTimeout(() => {
      // resetTranscript()
      // }, 2000);

    }

  return (
    <>
      {deck ? 
      <div className='speechQuiz'>
          <div className="word">{card? card.word : '...loading '}</div> <br />
          <textarea name="" id="" cols="30" rows="10"
            placeholder='start answering as soon as the word appear'
            value={transcript}
            onChange={() => console.log('yo')}
          ></textarea>
      </div>

      :<div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
    }
    </>
    
  )
}

export default SpeechQuiz

import { useState, useEffect } from 'react';
import { liveChat } from '../../../../../api/http';
import { useSelector } from 'react-redux';
import handleBlanks from "../../../yapping/utils/handleBlanks"

const useChatManager = (pair) => {
  const [currentSpeaker, setCurrentSpeaker] = useState('student');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [{ username, userId: userID}] = useState(JSON.parse(localStorage.getItem("user")))
  const { learning, name: topicName } = useSelector((state) => state.topic);
  const [words, setWords] = useState(learning.words.map(wordObj => wordObj.word))
  const [step, setStep] = useState('onboarding')
  const [wordSuccessAnimation, setWordSuccessAnimation] = useState(false)

  const addMessage = (speaker, content, type, textContent = null) => {
    const newMessage = {
      id: Date.now(),
      speaker,
      content,
      type,
      textContent,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStudentMessage = (text) => {
    if (!text.trim()) return;

    const { blanked, usedExpressions } = handleBlanks(text, words)
    if (usedExpressions?.length) {
      const stored = words
      setWords(usedExpressions)
      setWordSuccessAnimation(true)
      setTimeout(() => {
        setWordSuccessAnimation(false)
        setWords(stored.filter(word => !usedExpressions.includes(word)))
      }, 2000);
    }
    
    addMessage('student', text, 'text');
    setIsProcessing(true);

    console.log(step)

    liveChat({ chat: text, userID }).then(data => {
        setCurrentSpeaker('ai1')
        addMessage(
            'ai1', 
            data.reply, 
            'text',
            data.reply
        )

        setStep(data.stage)

        setTimeout(() => {
            setCurrentSpeaker('student');
            setIsProcessing(false);
          }, 1000);
    })
    
    // Simulate AI response after student speaks
    // In a real implementation, this would be an API call
    // setTimeout(() => {
    //   setCurrentSpeaker('ai1');
    //   addMessage(
    //     'ai1', 
    //     'AI response audio URL', 
    //     'audio',
    //     'This is AI1\'s response to your message.'
    //   );
      
    //     setTimeout(() => {
    //       setCurrentSpeaker('student');
    //       setIsProcessing(false);
    //     }, 1000);
    // }, 1000);
  };
  useEffect(() => {
    console.log(learning.words.map(wordObj => wordObj.word))
    liveChat({ step, userID, username, topic: topicName, words, agentPair: pair}).then(data => addMessage('ai1', data.reply, 'text', data.reply))
  }, [])

  const getCurrentMessage = () => {
    if (messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  return {
    currentSpeaker,
    messages,
    isProcessing,
    handleStudentMessage,
    getCurrentMessage,
    step, words, wordSuccessAnimation
  };
};

export default useChatManager;

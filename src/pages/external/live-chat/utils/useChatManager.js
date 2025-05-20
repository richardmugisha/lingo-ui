import { useState, useEffect } from 'react';
import { liveChat } from '../../../../api/http';
import { useSelector } from 'react-redux';

const useChatManager = () => {
  const [currentSpeaker, setCurrentSpeaker] = useState('student');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const username = useState(JSON.parse(localStorage.getItem("user")).username)
  const { learning, name } = useSelector((state) => state.topic);
  const [step, setStep] = useState('onboarding')


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
    
    addMessage('student', text, 'text');
    setIsProcessing(true);

    console.log(step)

    liveChat({ chat: text, step, words: learning.words.map(wordObj => wordObj.word) }).then(data => {
        setCurrentSpeaker('ai1')
        addMessage(
            'ai1', 
            data.chat, 
            'text',
            data.chat
        )

        if (data.ready == "1") setStep("lesson")

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
    liveChat({ chat: "", step}).then(data => addMessage('ai1', data.chat, 'text', data.chat))
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
    getCurrentMessage
  };
};

export default useChatManager;

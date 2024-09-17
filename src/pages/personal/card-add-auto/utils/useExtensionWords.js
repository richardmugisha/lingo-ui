import { useEffect, useRef, useState } from "react";

export const useExtensionWords = () => {
    const [isExtensionOpen, setIsExtensionOpen] = useState(false)
    const [extensionWords, setExtensionWords] = useState([])
    const oneTimeRef = useRef(0)
    useEffect(() => {
        if (oneTimeRef.current === 1) return;
        oneTimeRef.current = 1;
        fetchingExtensionData(setExtensionWords, setIsExtensionOpen)
    }, [])

    return [isExtensionOpen, extensionWords]
}

const fetchingExtensionData = (setExtensionWords, setIsExtensionOpen) => {
    let interval;
    const handleExtensionMessage = (event) => {
      if (event.data.type === 'FROM_EXTENSION') {
        const words = event.data.payload
        setExtensionWords(words || [])
        console.log('Data received from extension: ')
        console.log(words?.length + ' words: ' + words);
        window.postMessage({ type: 'CLEAR_STORAGE' }, '*')
        window.removeEventListener('message', handleExtensionMessage)
      }
    };
    
    let attempt = 0;
    const maxAttempts = 10; // or a suitable number
    const retrievingExtension = () => {
        if (attempt >= maxAttempts) {
            clearInterval(interval);
            console.log('Extension not found after multiple attempts.');
            return;
        }
        if (document.documentElement.dataset.hasExtension) {
            clearInterval(interval);
            setIsExtensionOpen(true);
            console.log('did it');
            window.postMessage({ type: 'REQUEST_DATA_FROM_EXTENSION' }, '*');
        } else {
            attempt++;
        }
    };



    // Call the function to check for the extension and request data
    retrievingExtension();

    // Add the event listener for messages from the extension
    window.addEventListener('message', handleExtensionMessage);

    // Cleanup function to remove the event listener
    return () => {
        clearInterval(interval)
        window.removeEventListener('message', handleExtensionMessage);
    };
  }

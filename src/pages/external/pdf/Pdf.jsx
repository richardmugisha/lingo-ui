import React, {useState, useEffect} from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './Pdf.css';

const Pdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelection = (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedFile(fileUrl);
    }
  };


  return (
    <div className="pdf">
      <h1 style={{fontSize: selectedFile? '16px': '5em'}}>PDF Viewer</h1>
      <PdfViewer selectedFile={selectedFile} onSelectFile={handleFileSelection} />
    </div>
  );
};

const PdfViewer = ({ selectedFile, onSelectFile }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [info, setInfo] = useState({
    exists: true, type: 'info', message: 'Select the word/expression you need to save!'
  })

  const handleWordApprove = (e) => {
    const word = window.getSelection().toString();
    if (e.key === 'Enter' && word) {
      const temp = JSON.parse(localStorage.getItem('temporary'))
      const words = [...new Set(temp?.words || [])];
      localStorage.setItem('temporary', JSON.stringify({ words: [...words, word]}) )
      setInfo({exists: true, type: 'info', message: 'Saved successfully!'})
    }
    else if (e.key === 'x') {
      setInfo({exists: false})
    }
  }

  const handleWordSelect = () => {
    const word = window.getSelection().toString();
    if (word) {
      setInfo({exists: true, type: 'info', message: `Now, hit Enter to save the word: ${word} or X otherwise!`})
    }
  }

  useEffect(() => {
    // Add event listeners to document level
    document.addEventListener('mouseup', handleWordSelect);
    document.addEventListener('keydown', handleWordApprove);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mouseup', handleWordSelect);
      document.removeEventListener('keydown', handleWordApprove);
    };
  }, []);

  useEffect(() => {
    let timerId;
    if (info.exists ) {
      timerId = setTimeout(() => {
        setInfo({exists: false})
      }, 5000);
    }
    return () => clearTimeout(timerId)
  }, [info])

  const [fullScreen, setFullScreen] = useState(false)

  //class="rpv-core_minimal-button"

  useEffect(() => {
    const handleFullScreen = () => {
      console.log('things')
      setFullScreen(prev => !prev)
    }
    const fullScreenBtn = document.getElementsByClassName('rpv-core_minimal-button')
    // console.log(fullScreen, 'some')
    // // if (fullScreenBtn) {
    // //   fullScreenBtn.style.display = 'none'
    // //   //fullScreenBtn.addEventListener('click', handleFullScreen )
    
    // // return fullScreenBtn.removeEventListener('click', handleFullScreen)
    // //}
    
  }, [selectedFile])

  return (
    <div className="pdf-viewer-container">
      {
        (selectedFile && info.exists) && <p className={`pdf-viewer--info pdf-viewer--info-${info.type}`}>
          {info.message}
        </p>
      }
      {!selectedFile && (
        <div className="pdf-upload">
          <label htmlFor="fileInput">
            Click here to upload a PDF file
          </label>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={(e) => onSelectFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {selectedFile && (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <div className={`pdf-viewer pdf-viewer--full-${fullScreen}`} >
            <Viewer fileUrl={selectedFile} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default Pdf;

import React, {useState} from 'react';
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

  return (
    <div className="pdf-viewer-container">
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
          <div className="pdf-viewer">
            <Viewer fileUrl={selectedFile} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default Pdf;

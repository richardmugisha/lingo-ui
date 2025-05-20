import { useRef, useEffect, useState } from 'react';

export default function AudioVisualizer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const animationRef = useRef(null);
  
  // Remote audio URL
  const audioUrl = "https://lynovo.s3.eu-north-1.amazonaws.com/script/The Epic Journey to the Luminous Mountain/audio/line-1.wav";
  
  useEffect(() => {
    // Set up canvas dimensions
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      
      // Draw initial user icon
      drawUserIcon();
    }
    
    // Initialize audio context
    try {
      const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(newAudioContext);
    } catch (err) {
      setError("WebAudio API not supported in this browser");
      console.error("WebAudio API Error:", err);
    }
    
    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const drawUserIcon = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw user icon
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw head
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius/4, radius/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw body
    ctx.beginPath();
    ctx.moveTo(centerX - radius/2, centerY);
    ctx.quadraticCurveTo(centerX, centerY + radius/1.5, centerX + radius/2, centerY);
    ctx.fill();
  };
  
  useEffect(() => {
    if (isPlaying && audioContext && analyser && dataArray) {
      const renderFrame = () => {
        animationRef.current = requestAnimationFrame(renderFrame);
        
        // Get frequency data
        analyser.getByteFrequencyData(dataArray);
        
        // Draw visualization
        drawVisualization();
      };
      
      renderFrame();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, audioContext, analyser, dataArray]);
  
  // Direct audio streaming approach
  const streamAudio = async () => {
    try {
      setError(null);
      
      // Resume audio context (needed due to autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Fetch the audio file
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to load audio`);
      }
      
      // Get audio data as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create buffer source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Create analyser
      const newAnalyser = audioContext.createAnalyser();
      newAnalyser.fftSize = 256;
      
      // Connect nodes
      source.connect(newAnalyser);
      newAnalyser.connect(audioContext.destination);
      
      // Create data array
      const bufferLength = newAnalyser.frequencyBinCount;
      const newDataArray = new Uint8Array(bufferLength);
      
      setAnalyser(newAnalyser);
      setDataArray(newDataArray);
      setIsPlaying(true);
      
      // Start playback
      source.start();
      
      // Handle when playback ends
      source.onended = () => {
        setIsPlaying(false);
        drawUserIcon();
      };
      
    } catch (err) {
      setError(`Failed to load audio`);
      console.error("Audio loading error:", err);
    }
  };
  
  const stopAudio = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    drawUserIcon();
  };
  
  const drawVisualization = () => {
    if (!canvasRef.current || !dataArray) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4; // Base radius for user icon
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw user icon
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw head
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius/4, radius/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw body
    ctx.beginPath();
    ctx.moveTo(centerX - radius/2, centerY);
    ctx.quadraticCurveTo(centerX, centerY + radius/1.5, centerX + radius/2, centerY);
    ctx.fill();
    
    // Draw audio visualization around the icon
    const barWidth = 3;
    const bars = dataArray.length;
    const angleStep = (2 * Math.PI) / bars;
    
    for (let i = 0; i < bars; i++) {
      const value = dataArray[i];
      const barHeight = value * 0.5; // Adjust for visualization intensity
      
      const angle = i * angleStep;
      
      const innerX = centerX + (radius + 5) * Math.cos(angle);
      const innerY = centerY + (radius + 5) * Math.sin(angle);
      
      const outerX = centerX + (radius + 5 + barHeight) * Math.cos(angle);
      const outerY = centerY + (radius + 5 + barHeight) * Math.sin(angle);
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(innerX, innerY, outerX, outerY);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(1, 'rgba(37, 99, 235, 1)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = barWidth;
      
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="relative w-64 h-64 mb-8">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0"
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <button 
          onClick={streamAudio}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isPlaying}
        >
          Play & Visualize
        </button>
        <button 
          onClick={stopAudio}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={!isPlaying}
        >
          Stop
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-4 text-white text-sm opacity-75">
        {isPlaying ? "Visualizing audio..." : "Click Play & Visualize to start"}
      </div>
    </div>
  );
}
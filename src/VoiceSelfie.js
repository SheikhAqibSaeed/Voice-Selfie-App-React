import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const VoiceSelfie = () => {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Sorry, your browser does not support Speech Recognition.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          if (transcript.includes('hi')) {
            capture();
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
    return () => recognition.stop();
    // eslint-disable-next-line
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCaptured(imageSrc);
      downloadImage(imageSrc);
    }
  };

  const downloadImage = (dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'selfie.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Voice-Activated Selfie Capture</h2>
      <p>Say <b>"hi"</b> to capture and download your photo!</p>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={350}
        videoConstraints={{ facingMode: 'user' }}
      />
      {captured && (
        <div style={{ marginTop: 20 }}>
          <h3>Your Selfie:</h3>
          <img src={captured} alt="Selfie" style={{ width: 200, borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
};

export default VoiceSelfie; 
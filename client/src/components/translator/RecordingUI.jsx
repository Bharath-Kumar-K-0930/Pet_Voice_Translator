import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, Square } from 'lucide-react';

const RecordingUI = ({ selectedPet }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, recording, analyzing, done
  const [translation, setTranslation] = useState('AI System Ready...');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleToggleRecording = () => {
    if (!selectedPet) {
      alert('Please select a pet mode first!');
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = handleSendAudio;
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setTranslation('Recording... speak now!');
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required to record.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setStatus('analyzing');
    setTranslation('Analyzing audio...');
    // Clean up tracks
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  const handleSendAudio = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];

    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('petType', selectedPet);

    try {
      // Remember to configure your Vite proxy or use full URL
      const { data } = await axios.post('/api/translate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Assuming ML service returns { emotion: 'happy' }
      // You would have a mapping from emotion to text
      const mockTranslations = {
        dog: { happy: "Woof! I'm so excited to see you!", hungry: "Bark! Is it dinner time yet?" },
        cat: { happy: "Purrrr... I require cuddles immediately.", hungry: "Meow! My food bowl is empty, human." }
      }
      setTranslation(mockTranslations[selectedPet][data.emotion] || "Translation complete.");
      setStatus('done');
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Error: Could not get translation.');
      setStatus('idle');
    }
  };

  const buttonClass = isRecording 
    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
    : "bg-cyan-500 hover:bg-cyan-600";

  return (
    <div>
      <button
        onClick={handleToggleRecording}
        className={`w-32 h-32 rounded-full text-white flex items-center justify-center mx-auto transition-all duration-300 shadow-lg ${buttonClass}`}
      >
        {isRecording ? <Square size={48} /> : <Mic size={48} />}
      </button>
      <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700 min-h-[80px]">
        <p className="text-lg font-mono">{translation}</p>
      </div>
    </div>
  );
};

export default RecordingUI;

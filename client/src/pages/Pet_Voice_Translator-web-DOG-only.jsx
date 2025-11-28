import React from 'react';
import RecordingUI from '../components/translator/RecordingUI';

const Pet_Voice_Translator_web_DOG_only = () => {
  const selectedPet = { type: 'dog', name: 'Canine Mode' };

  return (
    <div className="min-h-screen w-full pt-20 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pet Voice Translator - Web - DOG</h1>
          <p className="text-slate-400 mb-8">Translate your dog's sounds.</p>

          <RecordingUI selectedPet={selectedPet} />
        </div>
      </div>
    </div>
  );
};

export default Pet_Voice_Translator_web_DOG_only;

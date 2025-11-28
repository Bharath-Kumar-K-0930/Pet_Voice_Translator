import React from 'react';
import { Link } from 'react-router-dom';

const TranslatorPage = () => {
  return (
    <div className="min-h-screen w-full pt-20 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Neural Audio Interface</h1>
          <p className="text-slate-400 mb-8">Select a mode to begin translation.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/dog.html" className="block">
              <div className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-300 border border-slate-600 rounded-xl p-6 shadow-lg cursor-pointer">
                <div className="w-full h-48 bg-cover bg-center rounded-lg mb-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80')" }}></div>
                <h2 className="text-2xl font-semibold mb-2">Canine Mode</h2>
                <p className="text-slate-400 mb-4">Translate your dog's sounds</p>
                <p className="text-slate-500 text-sm">Understand barks, whines, growls, and howls. Detect emotions like happiness, anxiety, hunger, or pain. Perfect for dog owners who want to communicate better with their canine companions.</p>
              </div>
            </a>

            <a href="/cat.html" className="block">
              <div className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-300 border border-slate-600 rounded-xl p-6 shadow-lg cursor-pointer">
                <div className="w-full h-48 bg-cover bg-center rounded-lg mb-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80')" }}></div>
                <h2 className="text-2xl font-semibold mb-2">Feline Mode</h2>
                <p className="text-slate-400 mb-4">Translate your cat's sounds</p>
                <p className="text-slate-500 text-sm">Decode meows, purrs, hisses, and chirps. Identify moods from content purring to distressed meowing. Ideal for cat lovers seeking to understand their mysterious feline friends.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorPage;

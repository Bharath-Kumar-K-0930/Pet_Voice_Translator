import React from 'react';
import { PawPrint } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-6 py-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <PawPrint className="text-cyan-400" />
          <span className="text-lg font-bold text-white">PetSpeak AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} PetSpeak AI. Academic Project. All Rights Reserved.</p>
        <p className="text-sm mt-2">Connecting humans and their best friends through technology.</p>
      </div>
    </footer>
  );
};

export default Footer;

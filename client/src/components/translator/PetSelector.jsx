import React from 'react';

const PetSelector = ({ pets, selectedPet, onSelect }) => {
  return (
    <div className="flex justify-center gap-6 mb-8">
      {pets.map((pet) => (
        <div
          key={pet.type}
          onClick={() => onSelect(pet.type)}
          className={`cursor-pointer p-4 border-2 rounded-xl w-40 h-40 flex flex-col items-center justify-center transition-all duration-300
            ${selectedPet === pet.type
              ? 'border-fuchsia-500 bg-fuchsia-500/20 scale-105'
              : 'border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10'
            }`}
        >
          <span className="text-4xl mb-2">{pet.type === 'dog' ? '🐶' : '🐱'}</span>
          <span className="font-semibold">{pet.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PetSelector;

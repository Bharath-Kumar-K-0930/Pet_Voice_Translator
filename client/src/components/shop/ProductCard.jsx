import React from 'react';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-slate-400 text-sm mb-3">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-cyan-400 font-bold">${product.price}</span>
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>{product.category}</span>
          <span>{product.petType}</span>
        </div>
        <button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-md transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

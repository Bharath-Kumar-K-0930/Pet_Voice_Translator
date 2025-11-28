  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/shop/ProductCard';
import SearchBar from '../components/shop/SearchBar';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPetType, setSelectedPetType] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedPetType, products]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedPetType !== 'All') {
      filtered = filtered.filter(product => product.petType === selectedPetType);
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', 'Food', 'Toys', 'Health', 'Accessories'];
  const petTypes = ['All', 'Dog', 'Cat', 'Both'];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Pet Shop</h1>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedPetType}
            onChange={(e) => setSelectedPetType(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            {petTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;

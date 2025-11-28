import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const PetCareStoreDemo = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">PS</div>
          PetCareStoreDemo
        </div>
        <nav className="nav">
          <Link to="/login" className="btn btn-primary" style={{ marginLeft: '20px', padding: '10px 20px', fontSize: '14px', background: 'white', color: '#667eea', border: '2px solid white' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '14px', background: 'white', color: '#667eea', border: '2px solid white' }}>Register</Link>
        </nav>
      </header>

      <section className="store-section" style={{ padding: '80px 50px', minHeight: '80vh' }}>
        <h2 className="section-title">PetCare Store Demo</h2>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          This is a demo page for the PetCare Store. Here are some available products and items in our Store.,<br/>
          <b>Please Login for Shopping</b>
        </p>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Premium Dog Food</h4>
              <p>Nutritious meals for healthy dogs</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$29.99</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Interactive Cat Toy</h4>
              <p>Fun play for active cats</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$14.99</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Pet Health Supplements</h4>
              <p>Vitamins and wellness products</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$19.99</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Cozy Pet Bed</h4>
              <p>Comfortable relaxation gear</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$49.99</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616794619315-c8b0f03b3449?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Grooming Kit</h4>
              <p>Keep your pet clean and fresh</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$24.99</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Pet Accessories</h4>
              <p>Collars, leashes, and carriers</p>
              <p style={{ fontWeight: 'bold', color: '#667eea' }}>$15.99</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 PetSpeak AI - Pet Voice Translator & PetCare Store. Understanding pets, one bark at a time.</p>
        <p style={{ marginTop: '10px', opacity: 0.8 }}>Made with love for pet lovers everywhere</p>
      </footer>
    </div>
  );
};

export default PetCareStoreDemo;

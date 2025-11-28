import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">PS</div>
          PetSpeak AI
        </div>
        <nav className="nav">
          <a href="#translator">Translator</a>
          <a href="#pets">Pets</a>
          <a href="#store">Store</a>
          <a href="#about">About</a>
          <Link to="/login" className="btn btn-primary" style={{ marginLeft: '20px', padding: '10px 20px', fontSize: '14px', background: 'white', color: '#667eea', border: '2px solid white' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '14px', background: 'white', color: '#667eea', border: '2px solid white' }}>Register</Link>
        </nav>
      </header>

      <section className="hero">
        <h1>Finally Understand What Your Pet Is Saying</h1>
        <p>AI-powered pet voice translation that bridges the communication gap between you and your furry friend</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">Try Translator Now</Link>
          <Link to="/petshop-demo" className="btn btn-secondary">Shop PetCare Store</Link>
        </div>
      </section>

      <section className="features" id="translator">
        <h2 className="section-title">Revolutionary AI Pet Voice Translator</h2>
        <div className="feature-grid">
          <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=80&q=80')" }}>AI</div>
          <h3>Voice Recognition</h3>
          <p>Advanced AI analyzes your pet's vocalizations, meows, barks, and sounds in real-time to understand their emotional state and needs.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=80&q=80')" }}>EM</div>
          <h3>Emotion Detection</h3>
          <p>Identifies happiness, anxiety, hunger, pain, playfulness, and more through sophisticated machine learning algorithms.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=80&q=80')" }}>TR</div>
          <h3>Instant Translation</h3>
          <p>Get immediate translations of what your pet is communicating, helping you respond to their needs faster than ever.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&q=80')" }}>BT</div>
          <h3>Behavior Tracking</h3>
          <p>Monitor patterns over time to better understand your pet's health, mood changes, and daily routines.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?w=80&q=80')" }}>AL</div>
          <h3>Smart Alerts</h3>
          <p>Receive notifications when your pet expresses distress, discomfort, or urgent needs that require attention.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&q=80')" }}>MP</div>
          <h3>Multi-Pet Support</h3>
          <p>Works seamlessly with both cats and dogs, understanding breed-specific vocalizations and communication styles.</p>
        </div>
        </div>
      </section>

      <section className="pets-section" id="pets">
        <h2 className="section-title">Supporting Your Beloved Companions</h2>
        <div className="pets-container">
          <div className="pet-card">
            <div className="pet-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80')" }}></div>
            <div className="pet-content">
              <h3>Cats</h3>
              <p>Decode the mysterious language of your feline friend. From purrs to meows, understand every sound they make.</p>
              <ul className="pet-features">
                <li>Meow variations and meanings</li>
                <li>Purr intensity analysis</li>
                <li>Hiss and growl warnings</li>
                <li>Chirp and chatter translations</li>
                <li>Silent communication cues</li>
              </ul>
            </div>
          </div>
          <div className="pet-card">
            <div className="pet-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80')" }}></div>
            <div className="pet-content">
              <h3>Dogs</h3>
              <p>Understand your canine companion better than ever. Every bark, whine, and howl has meaning.</p>
              <ul className="pet-features">
                <li>Bark type identification</li>
                <li>Whine and whimper analysis</li>
                <li>Growl context understanding</li>
                <li>Howl and yodel interpretation</li>
                <li>Body language correlation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="store-section" id="store">
        <h2 className="section-title">PetCare Store - Everything Your Pet Needs</h2>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '20px' }}>Premium products curated for your pet's health, happiness, and wellbeing</p>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Premium Food</h4>
              <p>Nutritious meals for healthy pets</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Fun Toys</h4>
              <p>Interactive play for active minds</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Health Care</h4>
              <p>Supplements and wellness products</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Comfort Items</h4>
              <p>Cozy beds and relaxation gear</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616794619315-c8b0f03b3449?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Grooming</h4>
              <p>Keep your pet clean and fresh</p>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80')" }}></div>
            <div className="product-content">
              <h4>Accessories</h4>
              <p>Collars, leashes, and carriers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="importance" id="about">
        <div className="importance-content">
          <h2>Why PetSpeak AI Matters</h2>
          <p>For centuries, pet owners have wondered what their beloved companions are trying to tell them. Understanding your pet's emotions and needs isn't just about convenience—it's about their health, happiness, and the bond you share.</p>
          <p>Our AI Pet Voice Translator helps you respond to your pet's needs faster, prevent health issues by detecting discomfort early, reduce anxiety through better understanding, and strengthen the emotional connection between you and your pet.</p>
          <p>Combined with our curated PetCare store, we provide everything you need to ensure your pet lives their best life.</p>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div>Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50k+</div>
              <div>Happy Pet Parents</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div>Real-Time Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div>Translations Daily</div>
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

export default LandingPage;

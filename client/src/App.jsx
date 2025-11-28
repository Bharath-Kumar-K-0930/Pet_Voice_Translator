import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import TranslatorPage from './pages/TranslatorPage';
import Pet_Voice_Translator_web_DOG_only from './pages/Pet_Voice_Translator-web-DOG-only';
import Pet_Voice_Translator_web_CAT_only from './pages/Pet_Voice_Translator-web-CAT-only';
import PetCareStoreDemo from './pages/PetCareStoreDemo';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetShopPage from './pages/PetShopPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/shop';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/translate" element={<TranslatorPage />} />
        <Route path="/translate/dog" element={<Pet_Voice_Translator_web_DOG_only />} />
        <Route path="/translate/cat" element={<Pet_Voice_Translator_web_CAT_only />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shop" element={<PetShopPage />} />
        <Route path="/petshop" element={<PetShopPage />} />
        <Route path="/petshop-demo" element={<PetCareStoreDemo />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

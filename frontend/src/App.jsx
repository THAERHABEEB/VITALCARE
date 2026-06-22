import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Diagnosis from './pages/Diagnosis';
import Diseases from './pages/Diseases';
import Articles from './pages/Articles';
import Auth from './pages/Auth';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
      <div className="container" style={{ padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnose" element={<Diagnosis />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import axios from 'axios';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Ping the backend to wake up Hugging Face space
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/health`)
      .catch(err => console.log("Health check failed or waking up...", err));
  }, []);

  return (
    <AuthProvider>
      <Router>
      <Navbar />
      <div className="container" style={{ padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/diagnose" element={
            <ProtectedRoute>
              <Diagnosis />
            </ProtectedRoute>
          } />
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

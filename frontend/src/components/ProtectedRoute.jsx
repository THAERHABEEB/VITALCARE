import React, { useContext } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem('vitalcare_token');

  if (!user && !token) {
    // Render a beautiful Lock Screen instead of redirecting immediately or showing a toast
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          padding: '2rem'
        }}
      >
        <div 
          className="glass-panel" 
          style={{ 
            textAlign: 'center', 
            padding: '4rem 3rem', 
            maxWidth: '500px', 
            width: '100%',
            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{ 
            background: '#fee2e2', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: '0 auto 2rem auto' 
          }}>
            <Lock size={40} color="#dc2626" />
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            This page contains sensitive medical features and user data. Please log in to your account to unlock this area.
          </p>
          <Link 
            to="/auth" 
            state={{ from: location }} 
            className="btn-primary" 
            style={{ 
              display: 'inline-block', 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1.1rem', 
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            Login to Continue
          </Link>
        </div>
      </motion.div>
    );
  }

  return children;
};

export default ProtectedRoute;

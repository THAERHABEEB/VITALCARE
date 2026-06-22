import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setMessage(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (isLogin) {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        login(res.data.user);
        setMessage({ type: 'success', text: res.data.message });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/register`, formData);
        login(res.data.user);
        setMessage({ type: 'success', text: res.data.message });
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'An error occurred' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <motion.div 
        className="glass-panel"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-light)' }}>
            {isLogin ? 'Enter your details to access your account' : 'Join us for smarter, healthier living'}
          </p>
        </div>

        {message && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', textAlign: 'center' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'relative' }}
              >
                <User size={20} color="var(--text-light)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  style={{ paddingLeft: '3rem' }} 
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div style={{ position: 'relative' }}>
            <Mail size={20} color="var(--text-light)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              style={{ paddingLeft: '3rem' }} 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-light)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              style={{ paddingLeft: '3rem' }} 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          <motion.button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '1rem' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={toggleAuthMode} 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600' }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;

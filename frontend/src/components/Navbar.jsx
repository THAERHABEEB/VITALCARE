import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, logout } = React.useContext(AuthContext);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/diagnose', label: 'Diagnosis' },
    { path: '/diseases', label: 'Diseases' },
    { path: '/articles', label: 'Articles' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ 
        padding: '1.5rem 0', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}
    >
      <div className="container">
        <div className="glass-panel flex justify-between items-center" style={{ padding: '0.8rem 2rem', borderRadius: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)', backdropFilter: 'blur(20px)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.4rem', color: 'var(--bg-dark)' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
              <Stethoscope size={22} color="white" />
            </div>
            VITALCARE
          </Link>

          <div style={{ display: 'flex', gap: '2.5rem', fontWeight: 600, position: 'relative' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                style={{ 
                  color: location.pathname === link.path ? 'var(--primary-color)' : 'var(--text-light)',
                  position: 'relative',
                  padding: '0.5rem 0',
                  transition: 'color 0.3s ease'
                }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'var(--primary-color)',
                      borderRadius: '3px'
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bg-dark)', fontWeight: 600 }}>
                  <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '50%' }}><UserIcon size={18} color="var(--primary-color)" /></div>
                  {user.name.split(' ')[0]}
                </div>
                <motion.button 
                  onClick={logout}
                  className="btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '0.5rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </div>
            ) : (
              <Link to="/auth">
                <motion.button 
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '0.7rem 1.8rem', borderRadius: '25px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user on initial load
    const storedUser = localStorage.getItem('vitalcare_user');
    const storedToken = localStorage.getItem('vitalcare_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    } else {
        localStorage.removeItem('vitalcare_user');
        localStorage.removeItem('vitalcare_token');
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('vitalcare_user', JSON.stringify(userData));
    localStorage.setItem('vitalcare_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vitalcare_user');
    localStorage.removeItem('vitalcare_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

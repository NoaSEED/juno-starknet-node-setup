import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedAuth = localStorage.getItem('galicia_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Credenciales simples: usuario y contraseña "Fei"
    if (username === 'Fei' && password === 'Fei') {
      const userData = {
        username: 'Fei',
        name: 'Fei',
        email: 'fei@galicia.com.ar',
        accountNumber: '1234567890',
        balance: 125000.50
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('galicia_auth', JSON.stringify({ user: userData }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('galicia_auth');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

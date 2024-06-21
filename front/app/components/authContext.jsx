'use client'
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState( typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') || null : null );

  const updateToken = (newToken) => {
    if (newToken === null) {
    sessionStorage.setItem('token', newToken);
    } else {
      sessionStorage.removeItem('token')
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { token, updateToken } = useContext(AuthContext);
  return [token, updateToken];
};

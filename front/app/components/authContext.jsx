'use client'
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState( typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') || null : null );

  const updateToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem('token', newToken);
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

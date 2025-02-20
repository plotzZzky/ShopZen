"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getUserProfile();

        if (token) {
          setUserProfile(token);
        };
        
      } catch (error) {
        console.error('Erro ao obter o perfil do usuário:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

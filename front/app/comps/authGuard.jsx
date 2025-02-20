"use client";
import { useEffect, useState, } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from './authProvider';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const getPath = usePathname();
  const [loading, setLoading] = useState(true);
  
  const { userProfile } = useAuth();

  useEffect(() => {
    if (loading) {
      setLoading(false);
      return;
    };

    if (getPath !== "/") {
      checkLogin(); // Se não for a home verifica o token
    };

  }, [userProfile]);

  function checkLogin() {
    if (!userProfile?.token) {
      router.push("/"); // Redireciona se não houver token
    };
  };

  if (userProfile?.token || getPath === "/") {
    return (
      <>
        {children}  {/* Exibe o conteúdo protegido se o usuário estiver autenticado ou for a raiz do site */}
      </>
    )
  };

  return (
    <section>
      <h2>Carregando...</h2>
    </section>
  )
};

export default AuthGuard;

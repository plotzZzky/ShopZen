"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from './authProvider';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const getPath = usePathname();
  
  const { userProfile, setUserProfile } = useAuth();

  useEffect(() => {
    if (userProfile === undefined) { // Se não tiver o token redireciona para a raiz do site
      router.push("/")
    };

    if (getPath !== "/") {
      checkLogin(); // Se não for a home verifica o token
    };

  }, [getPath, userProfile]);

  function checkLogin() {
    if (!userProfile?.jwt) {
      router.push("/");  // Redireciona se não houver JWT ou token
    };
  };

  if (userProfile?.jwt && userProfile?.token || getPath === "/") {
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

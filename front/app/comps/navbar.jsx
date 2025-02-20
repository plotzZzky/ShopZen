'use client'
import { useAuth } from './authProvider'
import { useRouter, usePathname } from 'next/navigation'
import { handleLogin } from './supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faHome, faQuestion, faUsers, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function NavBar() {
  const router = useRouter();
  const getPath = usePathname();
  const { userProfile } = useAuth();

  function openResponsiveMenu() {
    // Função que abre o menu no modo responsivo
    const navbar = document.getElementById("menu")

    if (navbar.className == "menu") {
      navbar.classList.add("responsive");
    } else {
      navbar.className = "menu";
    };
  };

  function closeResponsiveMenu() {
    // Função que fecha o menu no modo responsivo
    const navbar = document.getElementById('menu');
    navbar.classList.remove("responsive");
  };

  // Criam os item na navbar dependendo da pagina acessada
  const ABOUT = () => {
    return getPath === '/' ? (
      <span onClick={goAbout}>
        <FontAwesomeIcon icon={faUsers}/> Sobre
      </span>
    ) : null
  };

  const FAQ = () => {
    return getPath === '/' ? (
      <span onClick={goFaq}>
        <FontAwesomeIcon icon={faQuestion}/> Dúvidas
      </span>
    ) : null
  };

  const LOGIN = () => {
    return !userProfile?.token? (
      <div style={{justifyContent: 'flex-end'}}>
        <span onClick={handleLogin}>
          <FontAwesomeIcon icon={faUser}/> Entrar
        </span>
      </div>
    ) : null
  };

  const Shopping = () => {
    return userProfile?.token? (
      <span onClick={goShopping}>
        <FontAwesomeIcon icon={faCartShopping}/> Compras
      </span>
    ) : null
  }

  const Pantry = () => {
    return userProfile?.token? (
      <span onClick={goPantry}>
        <FontAwesomeIcon icon={faUser}/> Dispensa
      </span>
    ) : null
  }

  //Funções de navegação pelas paginas
  function goHome() {
    if (getPath === '/') {
      document.getElementById('Start').scrollIntoView();
    } else {
      router.push('/');
    }
    closeResponsiveMenu();
  };

  function goAbout() {
    document.getElementById('About').scrollIntoView();
    closeResponsiveMenu();
  };

  function goFaq() {
    document.getElementById('Faq').scrollIntoView();
    closeResponsiveMenu();
  };

  function genericGoToUrl(nextUrl) {
    /** Função generica para redirecionamento, se token for null redireciona para /login do contrario para a pagina passada como parametro
    * @param {string} 
    **/
    if (userProfile?.token && getPath !== nextUrl) {
      router.push(nextUrl);
    };

    closeResponsiveMenu();
  };

  function goShopping() {
    genericGoToUrl("/shop");
  };

  function goPantry() {
    genericGoToUrl("/pantry");
  };

  return (
    <nav>
      <div className='navbar-align'>

        <div className="menu" id="menu">
          <span id='menuBtn'>
            <FontAwesomeIcon icon={faBars} className="menu-icon" onClick={openResponsiveMenu}/>
          </span>
          
          <span onClick={goHome}>
            <FontAwesomeIcon icon={faHome} /> Inicio
          </span>

          {ABOUT()}

          {FAQ()}

          {Shopping()}

          {Pantry()}

        </div>

        {LOGIN()}
      </div>
    </nav>
  )
}
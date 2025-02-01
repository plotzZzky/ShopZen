'use client'
import { getUserJsonFromSupabase } from './supabase'
import { useRouter, usePathname } from 'next/navigation'
import { supaBase } from './supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faHome, faQuestion, faUsers, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function NavBar(props) {
  const userProfile = getUserJsonFromSupabase();
  const router = useRouter();
  const getPath = usePathname();

  function openResponsiveMenu() {
    // Função que abre o menu no modo responsivo
    const navbar = document.getElementById("menu")

    if (navbar.className == "menu") {
      navbar.classList.add("responsive");
    } else {
      navbar.className = "menu";
    }
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
    return !userProfile?.jwt? (
      <span onClick={handleLogin}>
        <FontAwesomeIcon icon={faUser}/> Entrar
      </span>
    ) : null
  };

  const Shopping = () => {
    return userProfile?.jwt? (
      <span onClick={goShopping}>
        <FontAwesomeIcon icon={faCartShopping}/> Compras
      </span>
    ) : null
  }

  const Pantry = () => {
    return userProfile?.jwt? (
      <span onClick={goPantry}>
        <FontAwesomeIcon icon={faUser}/> Dispensa
      </span>
    ) : null
  }

  const APPBAR = () => {
    return props.appbar?(
      <div className="nav-div">
        {props.appbar?.()}
      </div>
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
    if (userProfile?.jwt && getPath !== nextUrl) {
      router.push(nextUrl);
    };

    showLoginAlert();
    closeResponsiveMenu();
  };

  function goShopping() {
    genericGoToUrl("/shop");
  };

  function goPantry() {
    genericGoToUrl("/pantry");
  };

  const handleLogin = async () => {
    const result = await supaBase.auth.signInWithOAuth({
      provider: "google",
      });
  };

  // Mostra o alerta de login
  function showLoginAlert() {
    const alert = document.getElementById('loginAlert');
    alert.style.visibility = 'visible';
    setTimeout(() => {
      alert.style.visibility = 'hidden';
    }, 2000);
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

        {APPBAR()}

        <div style={{justifyContent: 'flex-end'}}>
          {LOGIN()}
        </div>
      </div>
    </nav>
  )
}
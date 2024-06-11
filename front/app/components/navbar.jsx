'use client'
import { useState } from 'react'
import { useAuth } from './authContext'
import { useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faHome, faQuestion, faUsers, faRightFromBracket, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function NavBar(props) {
  const [getToken, setToken] = useAuth();

  const router = useRouter();
  const getPath = usePathname();

  // Função que abre o menu no modo responsivo
  function openResponsiveMenu() {
    const navbar = document.getElementById("menu")
    if (navbar.className == "menu") {
      navbar.classList.add("responsive");
    } else {
      navbar.className = "menu";
    }
  };

  // Função que fecha o menu no modo responsivo
  function closeResponsiveMenu() {
    const navbar = document.getElementById('menu')
    navbar.classList.remove("responsive");
  };

  // Criam os item na navbar dependendo da pagina acessada
  const ABOUT = () => {
    return getPath === '/' ? (
      <div className="menu-item" onClick={goAbout}>
        <span><FontAwesomeIcon icon={faUsers}/> Sobre </span>
      </div>
    ) : null
  };

  const FAQ = () => {
    return getPath === '/' ? (
      <div className="menu-item" onClick={goFaq}>
        <span><FontAwesomeIcon icon={faQuestion}/> Dúvidas </span>
      </div>
    ) : null
  };

  const LOGIN = () => {
    return getToken === null? (
      <div className="menu-item" onClick={goLogin}>
        <span><FontAwesomeIcon icon={faUser}/> Entrar </span>
      </div>
    ) : (
      <div className="menu-item" onClick={goLogin}>
        <span><FontAwesomeIcon icon={faRightFromBracket}/> Sair </span>
      </div>
    )
  };

  const Shopping = () => {
    return getToken !== null? (
      <div className="menu-item" onClick={goShopping}>
        <span><FontAwesomeIcon icon={faCartShopping}/> Compras </span>
      </div>
    ) : null
  }

  const Pantry = () => {
    return getToken !== null? (
      <div className="menu-item" onClick={goPantry}>
        <span><FontAwesomeIcon icon={faUser}/> Dispensa </span>
      </div>
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
  }

  function goFaq() {
    document.getElementById('Faq').scrollIntoView();
    closeResponsiveMenu();
  }

  function genericGoTo(value) {
    //Função generica para redirecionamento, se tokne for null redireciona para /login do contrario para a pagina passada como parametro
    if (getToken !== null && typeof getToken === 'string') {
      if (getPath !== value) {
        router.push(value);
      }
    } else {
      if (getPath === "/login") {
        showLoginAlert()
      } else {
        router.push("/login");
      }
    }
    closeResponsiveMenu();
  };

  function goShopping() {
    genericGoTo("/shop")
  }

  function goPantry() {
    genericGoTo("/pantry")
  }

  function goLogin() {
    if (getToken === null) {
      router.push("/login")
    } else {
      sessionStorage.removeItem("token")
      router.push("/")
    }
  }

  // Mostra o alerta de login
  function showLoginAlert() {
    const alert = document.getElementById('loginAlert');
    alert.style.visibility = 'visible';
    setTimeout(() => {
      alert.style.visibility = 'hidden';
    }, 2000);
  }

  return (
    <nav>
      <div className='navbar-align'>
        <div className="menu" id="menu">
          <FontAwesomeIcon icon={faBars} className="menu-icon" onClick={openResponsiveMenu}/>

          <div className="menu-item" onClick={goHome}>
            <span><FontAwesomeIcon icon={faHome} /> Inicio </span>
          </div>

          {ABOUT()}

          {FAQ()}

          {Shopping()}

          {Pantry()}

        </div>

        {APPBAR()}

        <div className="nav-div" style={{justifyContent: 'flex-end'}}>
          {LOGIN()}
        </div>
      </div>
    </nav>
  )
}
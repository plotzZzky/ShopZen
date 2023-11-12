import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBars, faUser, faQuestion, faHands, faCartShopping, faU } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function NavBar() {
  const [getToken, setToken] = useState(sessionStorage.getItem('token')); 

  // Adiciona os items a navbar se estiver na pagina home
  const Shopping = () => {
    return getToken === null? (
      <div className="menu-item" onClick={go_to_login}>
        <a><FontAwesomeIcon icon={faUser} className='icon-menu' /> Entrar </a>
      </div>
    ) : (
      <div className="menu-item" onClick={go_to_shopping}>
        <a><FontAwesomeIcon icon={faCartShopping} className='icon-menu' /> Compras </a>
      </div>
    );
  }

  const Pantry = () => {
    return getToken !== null? (
      <div className="menu-item" onClick={go_to_login}>
        <a><FontAwesomeIcon icon={faUser} className='icon-menu' /> Dispensa </a>
      </div>
    ) : null
  }

  function open_menu() {
    let navbar = document.getElementsByClassName("menu")[0];
    if (navbar.className == "menu") {
      navbar.classList.add("responsive")
    } else {
      navbar.className = "menu"
    }
  }

  function close_menu() {
    let navbar = document.getElementsByClassName("menu")[0];
    navbar.classList.remove("responsive")
  }

  // Melhorar isso!!!! 
  function show_home_menu() {
    const url = window.location.pathname
    const about = document.getElementById("About")
    const ask = document.getElementById("Ask")
    if (url !== '/site/') {
      ask.style.display = 'none'
      about.style.display = 'none'
    }
  }

  // Function to go
  function go_to_home() {
    if (location.pathname == '/site/') {
      document.getElementById('Start').scrollIntoView()
    } else {
      location.href = "/site/"
    }
    close_menu()
  }

  function go_to_about() {
    document.getElementById('AboutDiv').scrollIntoView()
    close_menu()
  }

  function go_to_faq() {
    document.getElementById('Faq').scrollIntoView()
    close_menu()
  }

  function go_to_shopping() {
    location.href = "/site/shopping/"
    close_menu()
  }

  function go_to_login() {
    if (getToken == undefined) {
      location.href = "/site/login/"
    } else {
      location.href = "/site/shopping/"
    }
  }

  useEffect(() => {
    show_home_menu()
  }, []);

  return (
    <div className="navbar">

      <div className='navbar-align'>

        <div className="menu" id="menu">
          <a className="menu-icon" onClick={open_menu}>
            <FontAwesomeIcon icon={faBars} />
          </a>

          <div className="menu-item" onClick={go_to_home}>
            <a><FontAwesomeIcon icon={faHouse} /> Inicio </a>
          </div>

          <div className="menu-item" onClick={go_to_about} id='About'>
            <a><FontAwesomeIcon icon={faUser} /> Sobre </a>
          </div>

          <div className="menu-item" onClick={go_to_faq} id='Ask'>
            <a><FontAwesomeIcon icon={faQuestion} /> Duvidas </a>
          </div>

          {Shopping()}

          {Pantry()}

        </div>
      </div>
    </div>
  )
}
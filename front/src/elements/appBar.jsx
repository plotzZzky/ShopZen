import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBars, faCartShopping, faShop } from '@fortawesome/free-solid-svg-icons'
import '../app.css'
import './navbar.css'


export default function AppBar() {

  function OpenMenu() {
    let navbar = document.getElementsByClassName("menu")[0];
    if (navbar.className == "menu") {
      navbar.classList.add("responsive")
    } else {
      navbar.className = "menu"
    }
  }

  function go_to_home() {
    if (location.pathname == '/') {
      document.getElementById('Start').scrollIntoView()
    } else {
      location.href = "/"
    }
  }

  function go_to_shopping() {
    location.href = "/site/shopping/"
  }

  function go_to_pantry() {
    location.href = "/site/pantry/"
  }

  return (
    <div className="navbar">
      <div className='navbar-align'>
        <div className="menu" id="menu">
          <a className="menu-icon" onClick={OpenMenu}>
            <FontAwesomeIcon icon={faBars} />
          </a>

          <div className="menu-item" onClick={go_to_home}>
            <a><FontAwesomeIcon icon={faHouse} className='icon-menu' /> Inicio </a>
          </div>

          <div className="menu-item" onClick={go_to_shopping}>
            <a><FontAwesomeIcon icon={faCartShopping} className='icon-menu' /> Compras </a>
          </div>

          <div className="menu-item" onClick={go_to_pantry}>
            <a><FontAwesomeIcon icon={faShop} className='icon-menu' /> Dispensa </a>
          </div>
        </div>
      </div>
    </div>
  )
}
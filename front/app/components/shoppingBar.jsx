'use client'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function ShoppingBar(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);

  // Filtra os cards pelo nome
  function filterItems(event) {
    const value = event.target.value.toLowerCase()
    const items = document.getElementsByClassName("card");
    Array.from(items).forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Adiciona os items da lista a dispensa e remove do carrinho
  function buyList() {
    const formData = new FormData();
    formData.append("cartId", props.cartId)

    const url = "http://127.0.0.1:8000/shop/cart/buy/"
    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
      .then((res) => res.json())
      .then(() => {
        props.getCart();
      })
  }

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
        <button className='app-btn' onClick={props.show_new}><FontAwesomeIcon icon={faPlus} className='icon-menu' /></button>
        <button className='app-btn' onClick={props.show_add}><FontAwesomeIcon icon={faCartPlus} className='icon-menu' /></button>
        <button className='app-btn' onClick={buyList}><FontAwesomeIcon icon={faCartShopping} className='icon-menu' /></button>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </div>
  )
}
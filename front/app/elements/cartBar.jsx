import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'
import './navbar.css'


export default function CartBar(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined'? sessionStorage.getItem('token') : null);

  // filter cards in list by name
  function filterItems(event) {
    const value = event.target.value.toLowerCase()
    const items = document.getElementsByClassName("item-card");
    Array.from(items).forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Update list from select
  function changeMarket(event) {
    const value = event.target.value
    props.market(value)
    props.getCart(value)
  }

  function showModalNew() {
    document.getElementById('ModalNewCart').style.display = 'block'
  }

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
          <button className='app-btn' onClick={showModalNew}><FontAwesomeIcon icon={faCartPlus} className='icon-menu' /></button>

          <select className='app-select' id='selectMarket' onChange={changeMarket}>
            <option> Mercado </option>
            <option> Farmacia </option>
            <option> PetShop </option>
          </select>

          <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>

      </div>
    </div>
  )
}
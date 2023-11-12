import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'
import '../app.css'
import './navbar.css'


export default function ShoppingBar(props) {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));


  // filter cards in list by name
  function filter_items(event) {
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

  // Buy all items in list
  function buy_list() {
    const value = document.getElementById("selectMarket").value
    const formData = new FormData();
    formData.append("market", value)
    
    let url = "http://127.0.0.1:8000/items/cart/buy/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
    .then((res) => res.json())
    .then(() => {
      props.getItems();
    })
  }

  // Update list from select
  function change_market(event) {
    const value = event.target.value
    props.getItems(value)
    props.market(value)
  }

  return (
    <div className="app-bar">
      <div className='app-bar-align'>

          <button className='app-btn' onClick={props.show_new}><FontAwesomeIcon icon={faPlus} className='icon-menu' /></button>

          <button className='app-btn' onClick={props.show_add}><FontAwesomeIcon icon={faCartPlus} className='icon-menu' /></button>

          <button className='app-btn' onClick={buy_list}><FontAwesomeIcon icon={faCartShopping} className='icon-menu' /></button>

          <select className='app-select' id='selectMarket' onChange={change_market}>
            <option > Mercado </option>
            <option > Farmacia </option>
          </select>

          <input type='text' className='app-filter' onChange={filter_items} placeholder='Buscar produto na lista'></input>

      </div>
    </div>
  )
}
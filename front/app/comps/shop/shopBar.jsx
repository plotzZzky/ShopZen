'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import '@comps/navbar.css'


export default function ShopBar() {

  function filterItems(event) {
    // filter cards in list by name
    const value = event.target.value.toLowerCase()
    const items = document.querySelectorAll(".card");

    items.forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      };
    });
  };

  function showModalNew() {
    document.getElementById('ModalNewCart').style.display = 'block';
  };

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
          <button onClick={showModalNew}><FontAwesomeIcon icon={faCartPlus} /></button>

          <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar uma lista de compras'></input>
      </div>
    </div>
  )
}
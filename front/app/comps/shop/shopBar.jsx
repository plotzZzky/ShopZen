'use client'
import { useAuth } from '../authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import '@comps/navbar.css'


export default function ShopBar() {
  const [getToken, setToken] = useAuth();

  // filter cards in list by name
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
  };

  function showModalNew() {
    document.getElementById('ModalNewCart').style.display = 'block';
  };

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
          <button className='app-btn' onClick={showModalNew}><FontAwesomeIcon icon={faCartPlus} /></button>
          <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </div>
  )
}
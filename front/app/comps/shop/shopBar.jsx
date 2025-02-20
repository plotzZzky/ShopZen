'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import '@comps/navbar.css'


export default function ShopBar(props) {

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
    props.showModal(true);
  };

  return (
    <nav className="app-bar">
      <div className='app-bar-align'>

        <span onClick={showModalNew}>
          <FontAwesomeIcon icon={faCartPlus}/>
        </span>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar uma lista de compras'></input>
      </div>
    </nav>
  )
}
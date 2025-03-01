'use client'
import { getUserProfile } from '../supabase';
import { useParams } from 'next/navigation';
import { saveNewPantryOnSessionStorage } from '@pantry/pantrySS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useHeaders } from '../headers';
import '@comps/navbar.css'


export default function CartBar(props) {
  const userProfile = getUserProfile();
  const urlParams = useParams();
  const headers = useHeaders();

  function filterItems(event) {
    // Filtra os cards pelo nome
    const value = event.target.value.toLowerCase()
    const items = document.querySelectorAll(".card");
    
    items.forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  function buyList() {
    // Adiciona os items da lista a dispensa e remove do carrinho
    const url = process.env.NEXT_PUBLIC_SHOP_BUY_URL;

    const form = new FormData();
    form.append("cartId", urlParams?.id)
    form.append("owner", userProfile?.id)

    const requestData = {
      method: 'POST',
      body: form,
      headers: headers
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then((data) => {
        saveNewPantryOnSessionStorage(data)
        props.getCart();
      })
  };

  function showModalAdd() {
    props.showModalAddItem(true);
  };

  function showModalNew() {
    props.showModalNewItem(true);
  };

  return (
    <nav className="app-bar">
      <div className='app-bar-align'>
        <span onClick={showModalNew}>
          <FontAwesomeIcon icon={faPlus} />
        </span>

        <span onClick={showModalAdd}>
          <FontAwesomeIcon icon={faCartPlus}/>
        </span>

        <span onClick={buyList}>
          <FontAwesomeIcon icon={faCartShopping}/>
        </span>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </nav>
  )
}
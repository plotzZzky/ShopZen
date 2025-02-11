'use client'
import { getUserProfile } from '../supabase';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'
import '@comps/navbar.css'


export default function CartBar(props) {
  const userProfile = getUserProfile();
  const urlParams = useParams();

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
    const form = new FormData();
    form.append("cartId", urlParams.id)

    const url = "http://127.0.0.1:8000/cart/buy/"

    const requestData = {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      }
    };

    fetch(url, requestData)
      .then((res) => res.json())
      .then(() => {
        props.getCart();
      })
  };

  function showModalAdd() {
    document.getElementById('ModalAdd').style.display = 'block'
  };

  function showModalNew() {
    document.getElementById('ModalNew').style.display = 'block'
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
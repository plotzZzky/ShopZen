'use client'
import { useAuth } from '../authContext';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'
import '@comps/navbar.css'


export default function CartBar(props) {
  const [getToken, setToken] = useAuth();
  const urlParams = useParams();

  function filterItems(event) {
    // Filtra os cards pelo nome
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

  function buyList() {
    // Adiciona os items da lista a dispensa e remove do carrinho
    const formData = new FormData();
    formData.append("cartId", urlParams.id)

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

  function showModalAdd() {
    document.getElementById('ModalAdd').style.display = 'block'
  }

  function showModalNew() {
    document.getElementById('ModalNew').style.display = 'block'
  }

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
        <button className='app-btn' onClick={showModalNew}><FontAwesomeIcon icon={faPlus}/></button>
        <button className='app-btn' onClick={showModalAdd}><FontAwesomeIcon icon={faCartPlus}/></button>
        <button className='app-btn' onClick={buyList}><FontAwesomeIcon icon={faCartShopping}/></button>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </div>
  )
}
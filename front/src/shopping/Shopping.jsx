import { useState, useEffect } from 'react'
import '../app.css'
import ModalAdd from '../elements/modalAddItem';
import ModalNew from '../elements/modalNew';
import AppBar from '../elements/appBar';
import ShoppingBar from '../elements/shoppingBar';
import ShoppingCard from '../elements/shoppingCard';


export default function Shoping() {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));
  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");
  const [getShowModal, setShowModal] = useState(false)


  function check_login() {
    if (getToken == undefined) {
      location.href = "/site/login/";
    } else {
      get_items()
    }
  }

  function get_items(market) {
    let url = "http://127.0.0.1:8000/items/cart/";
    const formData = new FormData();
    formData.append("market", market != undefined ? market : document.getElementById("selectMarket").value)
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken },
    };
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        create_shopping_cards(data['items']);
      });
  }
  
  function create_shopping_cards(value) {
    setCards(
      value.map((data, index) => (
        <ShoppingCard name={data.name} amount={data.amount} key={index} item_id={data.id} get_items={get_items}></ShoppingCard>
      ))
    );
  }

  function show_modal_add() {
    document.getElementById('ModalAdd').style.display = 'block'
    setShowModal(true)
  }

  function show_modal_new() {
    document.getElementById('ModalNew').style.display = 'block'
  }

  useEffect(() => {
    check_login()
  }, [])


  return (
    <div className='page'>
      <AppBar></AppBar>
      <ShoppingBar show_add={show_modal_add} show_new={show_modal_new} market={setMarket} getItems={get_items}></ShoppingBar>
      <div className='align-cards'>
        {getCards}
      </div>
      <ModalAdd getItems={get_items} show={getShowModal} setShow={setShowModal} market={getMarket}></ModalAdd>
      <ModalNew setShow={setShowModal} market={getMarket}></ModalNew>
    </div>
  )
}

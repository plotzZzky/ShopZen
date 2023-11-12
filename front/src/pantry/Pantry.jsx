import { useState, useEffect } from 'react'
import '../app.css'
import ModalAdd from '../elements/modalAddItem';
import AppBar from '../elements/appBar';
import PantryBar from '../elements/pantryBar';
import PantryCard from '../elements/pantryCard';


export default function Pantry() {
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
    let url = "http://127.0.0.1:8000/items/pantry/";
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
        <PantryCard data={data} key={index} getItems={get_items}></PantryCard>
      ))
    );
  }

  function show_modal() {
    document.getElementById('ModalProf').style.display = 'block'
    setShowModal(true)
  }

  useEffect(() => {
    check_login()
  }, [])


  return (
    <div className='page'>
      <AppBar></AppBar>
      <PantryBar show_modal={show_modal} market={setMarket} getItems={get_items}></PantryBar>
      <div className='align-cards'>
        {getCards}
      </div>
      <ModalAdd getItems={get_items} show={getShowModal} setShow={setShowModal} market={getMarket}></ModalAdd>
    </div>
  )
}

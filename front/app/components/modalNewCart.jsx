import { useState } from "react";

export default function ModalNewCart(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);
  const [getName, setName] = useState("");

  function closeModal() {
    document.getElementById("ModalNewCart").style.display = 'none'
  }

  function createNewCart() {
    const formData = new FormData();
    const market = document.getElementById("selectNewMarket").value
    formData.append("cartName", getName)
    formData.append("market", market)

    const url = "http://127.0.0.1:8000/shop/cart/"
    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        const items = JSON.stringify(data['items'])
        sessionStorage.setItem("items", items)
        props.getAllCarts()
        closeModal()
        setName("")
      })
  }



  function changeName(event) {
    const value = event.target.value
    setName(value)
  }

  return (
    <>
      <div className='modal-background' id="ModalNewCart" onClick={closeModal}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <a className="modal-title"> Criar nova lista de compras: </a>

          <div className="modal-align">
            <input className="modal-input" placeholder="Nome do lista de compras" onChange={changeName} value={getName}></input>
            <select className="modal-input" id="selectNewMarket" >
              <option> Mercado </option>
              <option> Farmacia </option>
              <option> PetShop </option>
            </select>
          </div>

          <div className="modal-btns">
            <button className='app-btn' onClick={createNewCart}> Criar </button>
            <button className='app-btn' onClick={closeModal}> Fechar </button>
          </div>
        </div>
      </div>
    </>
  )
}
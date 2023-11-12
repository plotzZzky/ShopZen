import { useState, useEffect } from "react";


export default function ModalNew(props) {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));

  // const from item
  const [getName, setName] = useState("");
  const [getValidate, setValidate] = useState("");


  function create_new_item() {
    const formData = new FormData();
    const market = document.getElementById("selectNewMarket").value
    formData.append("market", market)
    formData.append("name", getName)
    formData.append("validate", getValidate)

    let url = "http://127.0.0.1:8000/items/new/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        const items = JSON.stringify(data['items'])
        sessionStorage.setItem("items", items)
        close_modal()
      })
  }

  function set_name(event) {
    const value = event.target.value
    setName(value)
  }

  function set_validate(event) {
    const value = event.target.value
    setValidate(value)
  }

  function close_modal() {
    document.getElementById("ModalNew").style.display = 'none'
  }

  return (
    <div className='modal-background' id="ModalNew" onClick={close_modal}>
      <div className='modal-div-new' onClick={e => e.stopPropagation()}>
        <a className="new-title"> Criar novo item: </a>
        <div className="align-new-item-inputs">
          <input className="input-add" type='text' value={getName} onChange={set_name} placeholder="Digite o nome do produto"></input>
          <input className="input-add" type='number' min={0} value={getValidate} onChange={set_validate} placeholder="Digite a validade do produto"></input>
          <select className="select-new" id="selectNewMarket">
            <option> Mercado </option>
            <option> Farmacia </option>
          </select>
        </div>
        <div className="align-btn-add">
          <button className='app-btn' onClick={create_new_item}> Criar </button>
          <button className='app-btn' onClick={close_modal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
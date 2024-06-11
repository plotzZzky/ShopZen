import { useState } from "react";
import { useAuth } from "../authContext";


export default function ModalNewItem(props) {
  const [getToken, setToken] = useAuth();
  const [getName, setName] = useState("");
  const [getValidate, setValidate] = useState("");

  // cria um no item model para compras
  function createNewItem() {
    const formData = new FormData();
    const market = document.getElementById("selectNewMarket").value;
    formData.append("market", market);
    formData.append("name", getName);
    formData.append("validate", getValidate);
  
    const url = "http://127.0.0.1:8000/shop/new/";
    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    };
  
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        const items = JSON.stringify(data);
        sessionStorage.setItem("items", items);
        closeModal();
    })
  }
  
  function changeName(event) {
    const value = event.target.value
    setName(value)
  }

  function changeValidate(event) {
    const value = event.target.value
    setValidate(value)
  }

  function closeModal() {
    document.getElementById("ModalNew").style.display = 'none'
  }

  return (
    <div className='modal-background' id="ModalNew" onClick={closeModal}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        <a className="modal-title"> Criar novo item: </a>

        <div className="modal-align">
          <input className="modal-input" type='text' value={getName} onChange={changeName} placeholder="Digite o nome do produto"></input>
          <input className="modal-input" type='number' min={0} value={getValidate} onChange={changeValidate} placeholder="Digite a validade do produto"></input>
          <select className="modal-input" id="selectNewMarket">
            <option> Mercado </option>
            <option> Farmacia </option>
            <option> PetShop </option>
          </select>
        </div>
        
        <div className="modal-btns">
          <button className='btn-mini' onClick={createNewItem}> Criar </button>
          <button className='btn-mini' onClick={closeModal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
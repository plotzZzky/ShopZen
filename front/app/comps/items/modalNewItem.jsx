import { useState } from "react";
import { getUserProfile } from "../supabase";


export default function ModalCreateNewItem() {
  const userProfile = getUserProfile();

  const [getName, setName] = useState("");
  const [getValidate, setValidate] = useState("");

  function createNewItem() {
    // Cria um novo item model
    const market = document.getElementById("selectNewMarket").value;
    const newItem = {"name": getName, "market": market, "validate": getValidate }

    closeModal();
    saveItemOnSessionStorage(newItem);
    createItemOnBackEnd(market);
  };

  function createItemOnBackEnd(market) {
    // cria um no itemmodel para compras
    const form = new FormData();
    form.append("market", market);
    form.append("name", getName);
    form.append("validate", getValidate);
  
    const url = "http://127.0.0.1:8000/item/";

    const requestdata = {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      }
    };
  
    fetch(url, requestdata)
  };

  function saveItemOnSessionStorage(value) {
    const items = sessionStorage.getItem("items");
    let jsonItems = []
    
    if (items) {
      jsonItems = JSON.parse(items);
    };

    jsonItems.push(value);
    sessionStorage.setItem("items", JSON.stringify(jsonItems));
  };
  
// handling
  function handlingName(event) {
    const value = event.target.value;
    setName(value);
  };

  function handlingValidate(event) {
    const value = event.target.value;
    setValidate(value);
  };

  function closeModal() {
    document.getElementById("ModalNew").style.display = 'none';
  };

  return (
    <div className='modal-background' id="ModalNew" onClick={closeModal}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        
        <a className="modal-title"> Criar novo item: </a>

        <div className="modal-align">
          <input type='text' value={getName} onChange={handlingName} placeholder="Digite o nome do produto"></input>
          <input type='number' min={0} value={getValidate} onChange={handlingValidate} placeholder="Digite a validade do produto"></input>

          <select id="selectNewMarket">
            <option> Mercado </option>
            <option> Farmacia </option>
            <option> PetShop </option>
          </select>

        </div>
        
        <div className="modal-btns">
          <button onClick={createNewItem}> Criar </button>
          <button onClick={closeModal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
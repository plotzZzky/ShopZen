import { useState } from "react";
import { useHeaders } from "../headers";


export default function ModalCreateNewItem(props) {
  const headers = useHeaders();

  const [getName, setName] = useState("");
  const [getValidate, setValidate] = useState("");
  const [market, setMarket] = useState("Mercado");

  async function createNewItem() {
    // Cria um novo item model
    const newItem = await createItemOnBackEnd();

    saveItemOnSessionStorage(newItem);
    closeModal();
  };

  async function createItemOnBackEnd() {
    // cria um no itemmodel para compras
    const form = new FormData();
    form.append("market", market);
    form.append("name", getName);
    form.append("validate", getValidate);
  
    const url = process.env.NEXT_PUBLIC_ITEM_URL;

    const requestdata = {
      method: 'POST',
      body: form,
      headers: headers
    };
  
    const response = await fetch(url, requestdata);
    
    if (response.ok) {
      const newItem = await response.json();
      return newItem;
    }
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

  function handlingMarket(event) {
    const value = event.target.value;
    setMarket(value);
  };

  function closeModal() {
    props.setShow(false);
  };

  if (props.show) {
    return (
      <div className='modal-background' id="ModalNew" onClick={closeModal}>
        <div className='modal' onClick={e => e.stopPropagation()}>
          
          <a className="modal-title"> Criar novo item: </a>

          <div className="modal-align">
            <input type='text' value={getName} onChange={handlingName} placeholder="Digite o nome do produto"></input>
            <input type='number' min={0} value={getValidate} onChange={handlingValidate} placeholder="Digite a validade do produto"></input>

            <select value={market} id="selectNewMarket" onChange={e => handlingMarket(e)}>
              <option value={"Mercado"}> Mercado </option>
              <option value={"Farmácia"}> Farmácia </option>
              <option value={"PetShop"}> PetShop </option>
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
}
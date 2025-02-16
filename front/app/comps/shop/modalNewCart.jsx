import { useState } from "react";
import { getUserProfile } from "../supabase";
import { headers } from "../headers";

export default function ModalNewCart(props) {
  const userProfile = getUserProfile();
  const [cartName, setCartName] = useState("");

  function closeThisModal() {
    document.getElementById("ModalNewCart").style.display = 'none';
    setCartName("");
  };

  function createNewCart() {
    const url = process.env.NEXT_PUBLIC_SHOP_URL;

    const market = document.getElementById("selectNewMarket").value;

    const form = new FormData();
    form.append("name", cartName);
    form.append("market", market);
    form.append("owner", userProfile.id);

    const requestData = {
      method: 'POST',
      body: form,
      headers: headers,
    }

    fetch(url, requestData)
      .then((response) => {
        if (response.ok) {
          closeThisModal();
          props.getAllCarts();
        }
    })
  };

  function HandlingName(event) {
    const value = event.target.value;
    setCartName(value);
  };

  return (
    <>
      <div className='modal-background' id="ModalNewCart" onClick={closeThisModal}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <a className="modal-title"> Criar uma nova lista de compras: </a>

          <div className="modal-align">
            <input placeholder="Nome do lista de compras" onChange={HandlingName} value={cartName}></input>

            <select id="selectNewMarket" >
              <option>Mercado</option>
              <option>Farmacia</option>
              <option>PetShop</option>
            </select>
          </div>

          <div className="modal-btns">
            <button onClick={createNewCart}> Criar </button>
            <button onClick={closeThisModal}> Fechar </button>
          </div>

        </div>
      </div>
    </>
  )
}
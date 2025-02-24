import { useState } from "react";
import { getUserProfile } from "../supabase";
import { useHeaders } from "../headers";

export default function ModalNewCart(props) {
  const headers = useHeaders();
  const userProfile = getUserProfile();

  const [cartName, setCartName] = useState("");
  const [cartMarket, setCartMarket] = useState("Mercado");

  function closeThisModal() {
    props.setShow(false);
    setCartName("");
  };

  function createNewCart() {
    const url = process.env.NEXT_PUBLIC_SHOP_URL;

    const form = new FormData();
    form.append("name", cartName);
    form.append("market", cartMarket);
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


  function handlingMarket(event) {
    const value = event.target.value;
    setCartMarket(value);
  };

  if (props.show) {
    return (
      <>
        <div className='modal-background' id="ModalNewCart" onClick={closeThisModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <a className="modal-title"> Criar uma nova lista de compras: </a>

            <div className="modal-align">
              <input placeholder="Nome do lista de compras" onChange={HandlingName} value={cartName}></input>

              <select value={cartMarket} id="selectNewMarket" onChange={e => handlingMarket(e)}>
                <option value={"Mercado"}>Mercado</option>
                <option value={"Farmácia"}>Farmácia</option>
                <option value={"PetShop"}>PetShop</option>
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
}
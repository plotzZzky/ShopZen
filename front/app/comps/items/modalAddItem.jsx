import { useState, useEffect, useRef } from "react";
import { getUserProfile } from "../supabase";
import NewItemCard from "../cart/NewItemCard";


export default function ModalAdd(props) {
  const userProfile = getUserProfile();
  const didMount = useRef(false); // Controla a primeira renderização

  const [getCardsNew, setCardsNew] = useState([]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

    loadItemsModel();
  }, []);

  async function loadItemsModel() {
    const items = sessionStorage.getItem("items");

    if (items) {
      createCartItemCards(JSON.parse(items));
    } else {
      getItemsModelFromBackEnd();
    };
  };

  async function getItemsModelFromBackEnd() {
    const url = "http://127.0.0.1:8000/item/"

    const requestData = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      },
    }

    const response = await fetch(url, requestData);
    if (response.ok) {
      const data = await response.json()
      createCartItemCards(data)
      sessionStorage.setItem("items", JSON.stringify(data));
    }
  };

  function createCartItemCards(items) {
    // Cria os cards com os items models
    const market = "Mercado" // props.market
    
    if (items) {
      const filtered = items.filter(item => item.market === market);

      setCardsNew(
        filtered.map(({name, id, market}, index) => (
          <NewItemCard name={name} itemId={id} market={market} cartId={props.cartId} key={index} />
        ))
      );
    }
  };

  function filterNewItems(event) {
    // Filtra os items models
    const value = event.target.value.toLowerCase();
    const items = document.getElementsByClassName("card-new");
    
    Array.from(items).forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();
      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  function closeThisModal() {
    document.getElementById("ModalAdd").style.display = 'none';
    props.setShow(false);
  };


  return (
    <div className='modal-background' id="ModalAdd" onClick={closeThisModal}>
      <div className='modal-add' onClick={e => e.stopPropagation()}>
        <a className="modal-title"> Items para adicionar </a>

        <div className="modal-align-cards">
          <input className="modal-input" placeholder="Bucar algo" onChange={filterNewItems}></input>
          {getCardsNew}
        </div>

        <div className="modal-btns">
          <button className='btn-mini' onClick={closeThisModal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
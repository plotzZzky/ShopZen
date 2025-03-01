import { useState, useEffect } from "react";
import NewItemCard from "@/app/comps/items/newItemCard";
import ordeneItemsListByName from "@comps/utils"
import { useHeaders } from "../headers";


export default function ModalAddItemToCart(props) {
  const headers = useHeaders();

  const [getCardsNew, setCardsNew] = useState([]);

  useEffect(() => {

    loadItemsModel();
  }, [props.show]);

  async function loadItemsModel() {
    /**
     * Verifica se os itemModels estão salvos no sessionStorage
    */
    const items = sessionStorage.getItem("items");

    if (items) {
      createCartItemCards(JSON.parse(items));

    } else {
      getItemsModelFromBackEnd();
    };
  };

  async function getItemsModelFromBackEnd() {
    /**
     * Busca os itemModels no backEnd 
    */
    const url = process.env.NEXT_PUBLIC_ITEM_URL;

    const requestData = {
      method: "GET",
      headers: headers
    };

    const response = await fetch(url, requestData);

    if (response.ok) {
      const data = await response.json();
      createCartItemCards(data);
      sessionStorage.setItem("items", JSON.stringify(data));
    };
  };

  function createCartItemCards(items) {
    // Cria os cards com os items models
    if (items) {
      const market = props.market

      const filtered = items.filter(item => item.market === market);  // Somente cria os cards do market atual
      const ordened = ordeneItemsListByName(filtered)

      setCardsNew(
        ordened.map(({name, id, market}, index) => (
          <NewItemCard
            name={name}
            itemId={id}
            market={market}
            cartId={props.cartId}
            key={index}
            createCards={props.createCards}
          />
        ))
      );
    }
  };

  function filterNewItems(event) {
    // Filtra os items models
    const value = event.target.value.toLowerCase();
    const items = document.querySelectorAll(".card-new");
    
    items.forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      };
    });
  };

  function closeThisModal() {
    props.setShow(false);
  };

  if (props.show) {
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
}
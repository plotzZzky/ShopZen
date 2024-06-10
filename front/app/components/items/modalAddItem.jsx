import { useState, useEffect } from "react";
import ItemCard from "../cart/ItemCard";


export default function ModalAdd(props) {
  const [getCardsNew, setCardsNew] = useState([]);

  function closeModal() {
    props.getCart()
    document.getElementById("ModalAdd").style.display = 'none'
    props.setShow(false)
  }

  function createCards() {
    // Cria os cards com os items models
    const items = JSON.parse(sessionStorage.getItem("items"))
    const market = props.market
    const filtered = items.filter(item => item.market === market);
    setCardsNew(
      filtered.map((data, index) => (
        <ItemCard name={data.name} amount={data.amount} key={index} itemId={data.id} cartId={props.cartId}></ItemCard>
      ))
    );
  }

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
  }

  useEffect(() => {
    createCards()
  }, [props.show])

  return (
    <div className='modal-background' id="ModalAdd" onClick={closeModal}>
      <div className='modal-add' onClick={e => e.stopPropagation()}>
        <a className="modal-title"> Items para adicionar </a>

        <div className="modal-align-cards">
          <input className="modal-input" placeholder="Bucar algo" onChange={filterNewItems}></input>
          {getCardsNew}
        </div>

        <div className="modal-btns">
          <button className='app-btn' onClick={closeModal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
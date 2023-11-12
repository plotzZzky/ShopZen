import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";


export default function ModalAdd(props) {
  const [getCardsNew, setCardsNew] = useState([]);


  function close_modal() {
    document.getElementById("ModalAdd").style.display = 'none'
    props.getItems()
    props.setShow(false)
  }

  function create_cards() {
    const items = JSON.parse(sessionStorage.getItem("items"))
    const market = props.market
    const filtered = items.filter(item => item.market === market);
    setCardsNew(
      filtered.map((data, index) => (
        <ItemCard name={data.name} amount={data.amount} key={index} item_id={data.id}></ItemCard>
      ))
    );
  }

  function filter_new_items(event) {
    const value = event.target.value.toLowerCase();
    const items = document.getElementsByClassName("item-card-new");
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
    create_cards()
  }, [props.show])

  return (
    <div className='modal-background' id="ModalAdd" onClick={close_modal}>
      <div className='modal-div' onClick={e => e.stopPropagation()}>
        <div className="align-add-cards">
          <input className="input-add" placeholder="Bucar algo" onChange={filter_new_items}></input>
          {getCardsNew}
        </div>
        <div className="align-btn-add">
          <button className='app-btn' onClick={close_modal}> Fechar </button>
        </div>
      </div>
    </div>
  )
}
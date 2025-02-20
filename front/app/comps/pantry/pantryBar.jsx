'use client'
import { useState } from "react";

export default function PantryBar(props) {
  const [market, setMarket] = useState("Mercado");

  function filterItems(event) {
    const value = event.target.value.toLowerCase()
    const items = document.querySelectorAll(".item-card");

    items.forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };


  return (
    <nav className="app-bar">
      <div className='app-bar-align'>
        
        <select className='app-select' id='selectMarket' value={market} onChange={props.createCards}>
          <option value={"Mercado"}>Mercado</option>
          <option value={"Farmácia"}>Farmácia</option>
          <option value={"PetShop"}>PetShop</option>
        </select>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </nav>
  )
}
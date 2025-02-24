'use client'
import { useState } from "react";

export default function PantryBar(props) {
  const [market, setMarket] = useState("Selecione");

  function handlingMarket(event) {
    const value = event.target.value;
    setMarket(value);
    props.createCards(); // Cria os novos cards do market selecionado
  };


  return (
    <nav className="app-bar">
      <div className='app-bar-align'>
        
        <select className='app-select' id='selectMarket' value={market} onChange={handlingMarket}>
          <option disabled>Selecione</option>
          <option value={"Mercado"}>Mercado</option>
          <option value={"Farmácia"}>Farmácia</option>
          <option value={"PetShop"}>PetShop</option>
        </select>

        <input type='text' className='app-filter' onChange={handlingMarket} placeholder='Buscar produto na lista'></input>
      </div>
    </nav>
  )
}
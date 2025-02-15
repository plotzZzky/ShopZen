'use client'

export default function PantryBar(props) {

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
        
        <select className='app-select' id='selectMarket' onChange={props.createCards}>
          <option> Mercado </option>
          <option> Farmacia </option>
          <option> PetShop </option>
        </select>

        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </nav>
  )
}
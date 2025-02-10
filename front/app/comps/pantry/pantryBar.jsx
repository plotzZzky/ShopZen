'use client'

export default function PantryBar() {

  function filterItems(event) {
    const value = event.target.value.toLowerCase()
    const items = document.getElementsByClassName("item-card");
    Array.from(items).forEach(item => {
      const name = item.querySelector(".card-name").innerHTML.toLowerCase();

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  function changeMarket(event) {
    const value = event.target.value
    const items = document.getElementsByClassName("card");
    Array.from(items).forEach(item => {
      const name = item.querySelector(".card-market").innerHTML

      if (name.includes(value)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  return (
    <div className="app-bar">
      <div className='app-bar-align'>
        <select className='app-select' id='selectMarket' onChange={changeMarket}>
          <option> Mercado </option>
          <option> Farmacia </option>
          <option> PetShop </option>
        </select>
        <input type='text' className='app-filter' onChange={filterItems} placeholder='Buscar produto na lista'></input>
      </div>
    </div>
  )
}
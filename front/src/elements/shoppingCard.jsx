import { useState } from 'react'


export default function ShoppingCard(props) {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));

  function change_input_amount(event) {
    const value = event.target.value;
    const formData = new FormData();
    formData.append("amount", value)
    formData.append("id", props.item_id)
    
    let url = "http://127.0.0.1:8000/items/cart/update/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
    .then((res) => res.json())
    .then(() => {
      props.get_items();
    })
  }


  return (
    <div className='item-card'>
      <a className='card-name'> {props.name} </a>
      <input className='card-amount' type='number' value={props.amount} onChange={change_input_amount}></input>
    </div>
  )
}
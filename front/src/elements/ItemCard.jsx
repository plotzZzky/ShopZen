import { useState } from 'react'


export default function ItemCard(props) {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));

  function add_item() {
    const formData = new FormData();
    formData.append("id", props.item_id)
    let url = "http://127.0.0.1:8000/items/cart/add/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
  }


  return (
    <div className='item-card-new' onClick={add_item}>
      <a className='card-name'> {props.name} </a>
    </div>
  )
}
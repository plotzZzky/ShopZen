import { useState } from 'react'


export default function ItemCard(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined'? sessionStorage.getItem('token') : null);

  function addItem() {
    const formData = new FormData();
    formData.append("itemId", props.itemId)
    formData.append("cartId", props.cartId)
    formData.append("amount", '')

    const url = "http://127.0.0.1:8000/shop/item/"
    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
  }

  return (
    <div className='card-new' onClick={addItem}>
      <a className='card-name'> {props.name} </a>
    </div>
  )
}
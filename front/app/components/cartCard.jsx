import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function CartCard(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined'? sessionStorage.getItem('token') : null);
  const router = useRouter();

  function deleteCart(event) {
    event.stopPropagation() // Evita que chame a função showCart() ao clickar no botão de delete
    const cartId = props.id
    const url = `http://127.0.0.1:8000/shop/cart/${cartId}/`
    
    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
    props.delete()
  }

  function showCart() {
    router.push(`/shop/cart/${props.id}/`)
  }

  return (
    <div className='card' onClick={showCart}>
      <a className='card-name'> {props.name} </a>
      <FontAwesomeIcon icon={faTrash} onClick={deleteCart} />
    </div>
  )
}
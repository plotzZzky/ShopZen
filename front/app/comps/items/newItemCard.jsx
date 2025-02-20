import { createNewItemOnSessionSorage } from './itemSS';
import { useHeaders } from '../headers';


export default function NewItemCard(props) {
  const headers = useHeaders();

  async function addItemToCart() {
    // Recupera o carrinho do sessionStorage e faz o parse
    const newItem = await addItemToBackEnd()

    if (newItem) {
      createNewItemOnSessionSorage(props.cartId, props.itemId, newItem);
      props.createCards()
    };
  };
  
  async function addItemToBackEnd() {
    // Salva e retorna o item do backend
    const url = process.env.NEXT_PUBLIC_CART_URL;

    const form = new FormData();
    form.append("item", props.itemId);
    form.append("cart", props.cartId);
    
    const requestData = {
      method: 'POST',
      body: form,
      headers: headers
    };

    const res = await fetch(url, requestData)
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  };

  return (
    <div className='card-new' onClick={addItemToCart}>
      <a className='card-name'> {props.name} </a>
    </div>
  )
}
import { getUserProfile } from '../supabase';


export default function NewItemCard(props) {
  const userProfile = getUserProfile();

  async function addItemToCart() {
    // Recupera o carrinho do sessionStorage e faz o parse
    const newItem = await addItemToBackEnd()

    if (newItem) {
      const cart = sessionStorage.getItem(`Cart ${props.cartId}`);
      let parsedCart = cart ? JSON.parse(cart) : [];

      // Verifica se o item já existe no carrinho
      const existingItem = parsedCart.find(item => item.id === props.itemId);
    
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        existingItem.amount += 1;
      } else {
        parsedCart.push(newItem);
      };

      sessionStorage.setItem(`Cart ${props.cartId}`, JSON.stringify(parsedCart));
    };
  };
  
  async function addItemToBackEnd() {
    // Salva e retorna o item do backend
    const url = "http://127.0.0.1:8000/cart/";

    const form = new FormData();
    form.append("item", props.itemId);
    form.append("cart", props.cartId);
    
    const data = {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      }
    };

    const res = await fetch(url, data)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.data
      return data
    }
  };

  return (
    <div className='card-new' onClick={addItemToCart}>
      <a className='card-name'> {props.name} </a>
    </div>
  )
}
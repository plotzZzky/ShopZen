import { useRouter } from 'next/navigation';
import { getUserProfile } from '../supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function ShopCard(props) {
  const userProfile = getUserProfile();
  const router = useRouter();

  function showCartPage() {
    router.push(`/cart/${props.id}/`);
  };

  async function removeCartFromBackEnd(event) {
    /**
     * Envia a solicitação ao backend para deletar o cart
     */
    event.stopPropagation();
    props.delete(); // Remove o card da lista

    const itemID = props.id
    const url = `http://127.0.0.1:8000/shop/${itemID}/`

    const requestData = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      }
    };

    await fetch(url, requestData);
  };

  return (
    <div className='card' onClick={showCartPage}>
      <a className='card-name'> {props.name} </a>
      <FontAwesomeIcon icon={faTrash} onClick={e => removeCartFromBackEnd(e)} />
    </div>
  )
}
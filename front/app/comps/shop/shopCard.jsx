import { useRouter } from 'next/navigation';
import { useHeaders } from '../headers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function ShopCard(props) {
  const headers = useHeaders();
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
    const url =  process.env.NEXT_PUBLIC_SHOP_URL + `${itemID}/`;

    const requestData = {
      method: "DELETE",
      headers: headers
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
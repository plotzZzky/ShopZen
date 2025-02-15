import { useState, useEffect } from 'react'
import { headers } from '../headers';
import { changeAmountOnSessionSorage } from '../items/itemSS';


export default function ItemCartCard(props) {
  const [getAmount, setAmount] = useState();

  function changeAmount(event) {
    const amount = event.target.value;
    setAmount(amount)

    if (amount <= 0) {
      props.delete();
    };

    changeAmountOnSessionSorage(props.cartId, props.itemId, amount);
    changeAmountOnBack(amount);
  };
  
  function changeAmountOnBack(amount) {
    const url = `http://127.0.0.1:8000/cart/${props.itemId}/`;

    const form = new FormData();
    form.append("amount", amount);
    form.append("itemId", props.modelId);
    form.append("cartId", props.cartId);

    const requestData = {
      method: 'PATCH',
      body: form,
      headers: headers
    };

    fetch(url, requestData);
  };

  // Usado para resolver um bug, que quando adicionado mais uma unidade do item na lista (pelo modal para adicionar novos item), o getAmount não era atualiazado
  useEffect(() => {
    setAmount(props.amount)
  }, [props.amount])

  return (
    <div className='card'>
      <a className='card-name'> {props.name} </a>
      <input className='card-amount' type='number' value={getAmount} onChange={changeAmount}></input>
    </div>
  )
}
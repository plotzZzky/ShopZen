import { useState, useEffect } from 'react'


export default function CartCard(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);
  const [getAmount, setAmount] = useState();

  function changeInputAmount(event) {
    const value = event.target.value;
    if (value <= 0) {
      props.delete()
    };
    changeAmountOnBack(value);
  };

  function changeAmountOnBack(value) {
    setAmount(value)

    const formData = new FormData();
    formData.append("amount", value)
    formData.append("itemId", props.modelId)
    formData.append("cartId", props.cartId)

    const url = "http://127.0.0.1:8000/shop/item/"
    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }

    fetch(url, data);
  };

  // Usado para resolver um bug, que quando adicionado mais uma unidade do item na lista (pelo modal para adicionar novos item), o getAmount não era atualiazado
  useEffect(() => {
    setAmount(props.amount)
  }, [props.amount])

  return (
    <div className='card'>
      <a className='card-name'> {props.name} </a>
      <input className='card-amount' type='number' value={getAmount} onChange={changeInputAmount}></input>
    </div>
  )
}
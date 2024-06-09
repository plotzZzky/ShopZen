import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faExclamation, faCircleExclamation, faQuestion } from '@fortawesome/free-solid-svg-icons'


export default function PantryCard(props) {
  const [getToken, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);
  const [getDate, setDate] = useState(props.data.date)

  const ALERT = () => {
    const validate = props.data.validate;  // Prazo de validade do produto
    const date = new Date(props.data.date);  // Data de fabricação do produto
    const today = new Date();

    const dateOBJ = new Date(date);
    dateOBJ.setDate(dateOBJ.getDate() + validate);
    const diff = dateOBJ - today; // Diferença de dias, data de fabricação do produto - hoje

    const result = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return !props.data.date ? (
      <a><FontAwesomeIcon icon={faQuestion} /></a>
    ) : result <= 0 ? (
      <a><FontAwesomeIcon icon={faCircleExclamation} /></a>
    ) : result <= 7 ? (
      <a>{result} dias <FontAwesomeIcon icon={faExclamation} /></a>
    ) : (null)
  }

  // Muda a data de fabricação do produto no back
  function changeDate(event) {
    const value = event.target.value;
    const itemId = props.data.id

    const formData = new FormData();
    formData.append("date", value)
    setDate(value)

    const url = `http://127.0.0.1:8000/shop/pantry/${itemId}/`
    const data = {
      method: 'PATCH',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
  }

  // Remove o item da despensa no back
  function removeFromPantry() {
    const itemId = props.data.id
    const url = `http://127.0.0.1:8000/shop/pantry/${itemId}/`

    const data = {
      method: 'DELETE',
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
    props.delete() //Função que deleta o card do item no front
  }


  return (
    <div className='card'>
      <a className='card-name'> {props.data.item.name} </a>
      <div className='pantry-align-btn'>
        {ALERT()}
        <input className='card-date' type='date' value={getDate} onChange={changeDate}></input>
        <FontAwesomeIcon icon={faTrash} onClick={removeFromPantry} />
      </div>
    </div>
  )
}
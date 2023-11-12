import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faExclamation, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'


export default function PantryCard(props) {
  const [getToken, setToken] = useState(sessionStorage.getItem('token'));
  const [getDate, setDate] = useState(props.data.date)

  const alert = () => {
    const validate = props.data.validate;
    const date = new Date(props.data.date);    // Data de fabricação do produto
    const today = new Date();

    const dateOBJ = new Date(date);
    dateOBJ.setDate(dateOBJ.getDate() + validate);
    const diff = dateOBJ - today; // Diferença de dias, data de fabricação do produto - hoje

    const result = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return result <= 0 ? (
      <a><FontAwesomeIcon icon={faCircleExclamation} /></a>
    ) : result <= 7 ? (
      <a><FontAwesomeIcon icon={faExclamation}/> {result} dias</a>
    ) : (null)
  }

  // Muda a data de fabricação do produto
  function change_date(event) {
    const value = event.target.value;
    const formData = new FormData();
    formData.append("date", value)
    formData.append("id", props.data.id)
    setDate(value)

    let url = "http://127.0.0.1:8000/items/pantry/update/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
      .then(() => {
        props.getItems();
      })
  }

  // Remove o item da despensa
  function remove_from_pantry() {
    const formData = new FormData();
    formData.append("id", props.data.id)

    let url = "http://127.0.0.1:8000/items/pantry/delete/"
    let data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken }
    }
    fetch(url, data)
      .then((res) => res.json())
      .then(() => {
        props.getItems();
      })
  }


  return (
    <div className='item-card'>
      <a className='card-name'> {props.data.name} </a>
      <div className='pantry-align-btn'>
        {alert()}
        <input className='card-date' type='date' value={getDate} onChange={change_date}></input>
        <FontAwesomeIcon icon={faTrash} onClick={remove_from_pantry} />
      </div>
    </div>
  )
}
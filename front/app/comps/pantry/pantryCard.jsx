import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faExclamation, faCircleExclamation, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { useHeaders } from '../headers';
import "@app/app.css"


export default function PantryCard(props) {
  const headers = useHeaders();
  const [getDate, setDate] = useState(props.date || "");

  const ALERT = () => {
    const validate = props.validate;  // Prazo de validade do produto
    const date = new Date(props.date);  // Data de fabricação do produto
    const today = new Date();

    const dateOBJ = new Date(date);
    dateOBJ.setDate(dateOBJ.getDate() + validate);
    const diff = dateOBJ - today; // Diferença de dias, data de fabricação do produto - hoje

    const result = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return !props.date ? (
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
    const itemId = props.id

    const url = process.env.NEXT_PUBLIC_PANTRY_URL + `${itemId}/`;

    const form = new FormData();
    form.append("date", value)
    setDate(value)

    const requetsData = {
      method: 'PATCH',
      body: form,
      headers: headers
    };

    fetch(url, requetsData);
  };

  return (
    <div className='card'>
      <a className='card-name'>{props.name}</a>
      <a className='card-market'>{props.market}</a>
      <div className='pantry-align-btn'>
        {ALERT()}

        <input className='card-date' type='date' value={getDate} onChange={changeDate}></input>
        
        <FontAwesomeIcon icon={faTrash} onClick={props.delete} />
      </div>
    </div>
  )
}
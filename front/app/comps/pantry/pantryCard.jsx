import { useState } from 'react'
import { savePantryItemOnSessionStorage } from './pantrySS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faExclamation, faCircleExclamation, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { useHeaders } from '../headers';


export default function PantryCard(props) {
  const headers = useHeaders();
  const [getDate, setDate] = useState(props.date || " ");

  const validateAlert = () => {
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
  };

  function changeDateOnSessionStorage(event) {
    const itemID = props.id;
    const newDate = event.target.value;

    savePantryItemOnSessionStorage(itemID, newDate);
    changeDateOnBackEnd(newDate);
  };

  function changeDateOnBackEnd(value) {
    // Muda a data de fabricação do produto no back
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
        {validateAlert()}

        <input className='card-date' type='date' value={getDate} onChange={changeDateOnSessionStorage} />
        
        <FontAwesomeIcon icon={faTrash} onClick={props.delete} />
      </div>
    </div>
  )
}
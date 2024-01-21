import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'


export default function InputAnswer(props) {
  function updateLoginTip() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "A resposta deve ter mais de 3 digitos"
  }

  const ValidAnswer = (event) => {
    const value = event.target.value;
    if (value.length > 3) {
      props.setValid(true)
    } else {
      props.setValid(false)
    }
    props.answer(value)
  }


  return (
    <div className='div-input'>
      <input className='text-input' type="text" placeholder='Sua resposta'
        onChange={ValidAnswer} onFocus={updateLoginTip} >
      </input>
      <span className='input-div-icon'>
        {props.valid ?
          <FontAwesomeIcon icon={faCheck} className='icon-input-validate' /> :
          <FontAwesomeIcon icon={faX} className='icon-input' />
        }
      </span>
    </div>
  )
}
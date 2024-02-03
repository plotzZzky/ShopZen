import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'


export default function InputQuestion(props) {
  function updateLoginTip() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "Sua pergunta de recuperação de senha deve ter mais de 3 digitos"
  }

  const ValidQuestion = (event) => {
    const value = event.target.value;
    if (value.length > 3) {
      props.setValid(true)
    } else {
      props.setValid(false)

    }
    props.question(value)
  }

  useEffect(() => {
    const fakeEvent = { target: { value: props.value || '' } };
    ValidQuestion(fakeEvent)
  }, [props.value])

  return (
    <div className='div-input'>
      <input className='text-input' type="text" placeholder='Sua pergunta de recuperação de senha'
        onChange={ValidQuestion} onFocus={updateLoginTip} value={props.value}>
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
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faX, faCheck)


export default function InputUser(props) {

  function update_tip_login_password() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "Seu nome deve ter mais de 4 digitos"
  }

  const validate_user = (event) => {
    const value = event.target.value;
    if (value.length > 2) {
      props.setValid(true)
      props.username(value)
    } else {
      props.setValid(false)
    }
  }

  useEffect(() => {
    const fakeEvent = { target: { value: props.value || '' } };
    validate_user(fakeEvent)
  }, [props.value])

  return (
    <div className='div-input'>
      <input
        className='text-input' type='text' name='username' placeholder='Digite o nome do usuario' min={2}
        onChange={validate_user} onFocus={update_tip_login_password} value={props.value}>
      </input>
      <span className='input-div-icon'>{props.valid ?
        <FontAwesomeIcon icon="fa-solid fa-check" className='icon-input-validate' /> :
        <FontAwesomeIcon icon="fa-solid fa-x" className='icon-input' />
      }
      </span>
    </div>
  )
}
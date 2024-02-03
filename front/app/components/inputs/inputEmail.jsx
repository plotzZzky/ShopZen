import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'


export default function InputEmail(props) {

  function updateTipLoginPassword() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "O email precisa ser valido"
  }

  const validateEmail = (event) => {
    const value = event.target.value;
    if (value.includes('@') && value.includes("mail.com")) {
      props.setValid(true)
    } else {
      props.setValid(false)
    }
    props.email(value)
  }

  useEffect(() => {
    const fakeEvent = { target: { value: props.value || '' } };
    validateEmail(fakeEvent)
  }, [props.value])

  
  return (
    <div className='div-input'>
      <input
        className='text-input' type='email' name='email' placeholder='Digite seu email'
        onChange={validateEmail} onFocus={updateTipLoginPassword} value={props.value} >
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
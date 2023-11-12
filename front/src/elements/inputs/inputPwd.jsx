import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faX, faCheck)


export default function InputPwd(props) {

  function update_tip_login_password() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "A senha deve ter mais que 8 digitos"
  }

  const validate_email = (event) => {
    const value = event.target.value;
    if (value.length > 7) {
      props.setValid(true)
      props.password(value)
    } else {
      props.setValid(false)
    }
  }


  return (
    <div className='div-input'>
      <input
        className='text-input' type='password' name='password' placeholder={props.placeholder} min={8}
        onChange={validate_email} onFocus={update_tip_login_password} >
      </input>
      <div className='input-div-icon'>{props.valid ?
        <FontAwesomeIcon icon="fa-solid fa-check" className='icon-input-validate' /> :
        <FontAwesomeIcon icon="fa-solid fa-x" className='icon-input' />
      }
      </div>
    </div>
  )
}
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck, faEye, faEyeSlash, faEyeDropper, faEyeLowVision } from '@fortawesome/free-solid-svg-icons'


export default function InputPwd(props) {
  const [pwdVisible, setPwdVisible] = useState(false)

  function updateTipLoginPassword() {
    const tip = document.getElementById(props.tip)
    tip.innerText = "A senha precisa de letras, numeros e mais que 7 digitos"
  }

  function changePwdVisibility() {
    setPwdVisible(pwdVisible? false : true)
  }

  const validatePwd = (event) => {
    const value = event.target.value;
    if (validatePassword(value)) {
      props.setValid(true)
    } else {
      props.setValid(false)
    }
    props.password(value)
  }

  // Checka se senha e valida
  function validatePassword(password) {
    return password.length >= 8 && findChar(password);
  }
  
  // Verifica se na senha tem ao menos uma letra ou numero
  function findChar(text) {
    const char = [...text].some((char) => /[a-zA-Z]/.test(char));
    const digit = [...text].some((char) => /\d/.test(char));
    return char && digit;
  }

  return (
    <div className='div-input'>
      <input
        className='text-input' type={pwdVisible? 'text': 'password'} name='password' 
        placeholder={props.placeholder} min={8}
        onChange={validatePwd} 
        onFocus={updateTipLoginPassword} >
      </input>

      <div className='pwd-visible' onClick={changePwdVisibility}>
        { pwdVisible? 
          <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon> :
          <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
        }
      </div>

      <div className='input-div-icon'>
        {props.valid ?
          <FontAwesomeIcon icon={faCheck} className='icon-input-validate' /> :
          <FontAwesomeIcon icon={faX} className='icon-input' />
        }
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@comps/authContext';
import InputPwd from '@comps/inputs/inputPwd';
import InputEmail from '@comps/inputs/inputEmail';
import InputUser from '@comps/inputs/inputUser';
import InputAnswer from '@comps/inputs/inputAnswer';
import InputQuestion from '@comps/inputs/inputQuestion';


export default function Login() {
  const [getLogin, setLogin] = useState(true);
  const [getToken, setToken] = useAuth();
  const router = useRouter();

  const [getUsername, setUsername] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getpwd, setPwd] = useState("")
  const [getQuestion, setQuestion] = useState("");
  const [getAnswer, setAnswer] = useState("");

  //Validate
  const [UserValid, setUserValid] = useState(false);
  const [EmailValid, setEmailValid] = useState(false);
  const [Pwd1Valid, setPwd1Valid] = useState(false);
  const [Pwd2Valid, setPwd2Valid] = useState(false)
  const [QuestionValid, setQuestionValid] = useState(false)
  const [AnswerValid, setAnswerValid] = useState(false)

  function checkLogin() {
    if (getToken !== null && typeof getToken === 'string') {
      router.push("/shop");
    }
  }

  // Alterna entre a pagina de login e registro
  function showLogin() {
    const login = document.getElementById('loginTab');
    const signup = document.getElementById('signupTab');

    login.style.display = getLogin ? 'none' : 'block'
    signup.style.display = getLogin ? 'block' : 'none'
    setLogin(getLogin ? false : true)
  }

  // Redireciona para a pagina de recuperação de senha
  function showRecovery() {
    router.push('/login/recovery')
  }

  function checkIfLoginIsvalid() {
    // Verifica se os campos de login estão preenchidas com informções validas
    if (Pwd1Valid && UserValid) {
      loginFunc()
    } else {
      const tip = document.getElementById("LoginTip")
      tip.innerText = "Prencha os dados de login"
    }
  }

  function loginFunc() {
    // Função para fazer login
    const url = `http://127.0.0.1:8000/users/login/`

    const formData = new FormData();
    formData.append("username", getUsername)
    formData.append("password", getPassword)
    const info = {
      method: 'POST',
      body: formData
    }

    fetch(url, info)
    .then(res => res.json())

    .then((data) => {
      if (data.token) {
        const items = JSON.stringify(data.items)
        setToken(data.token)
        sessionStorage.setItem("items", items)
        router.push('/shop')

      } else {
        const tip = document.getElementById("LoginTip")
        tip.innerText = data.error
      }
    })
  }

  function checkIfSignIsValid() {
    // Verifica se os campos de cadastro estão preenchidas com informções validas
    if (UserValid && EmailValid && Pwd1Valid && Pwd2Valid && Pwd1Valid === Pwd2Valid) {
      SignUpFunc()
    } else {
      const tip = document.getElementById("SignTip")
      tip.innerText = "Prencha os dados para se registar"
    }
  }

  function SignUpFunc() {
    // Função para se registrar
    const url = `http://127.0.0.1:8000/users/register/`

    const formData = new FormData();
    formData.append("username", getUsername);
    formData.append("email", getEmail);
    formData.append("password", getPassword);
    formData.append("pwd", getpwd);
    formData.append("question", getQuestion)
    formData.append("answer", getAnswer)

    const requestData = {
      method: 'POST', body: formData
    }

    fetch(url, requestData)
      .then(res => res.json())
      .then((data) => {
        if (data.token) {
          const items = JSON.stringify(data.items)
          setToken(data.token)
          sessionStorage.setItem("items", items)
          router.push('/shop')

        } else {
          const tip = document.getElementById("LoginTip")
          tip.innerText = data.error
        }
      })
  }

  useEffect(() => {
    checkLogin()
  }, [getToken]);

  return (
    <>
      <div className='page banner'>
        <div className="login-page">
          <div className="login-alert" id='loginAlert'>
            <a> Você precisa fazer login!</a>
          </div>
          <div className='login-div' id='loginTab'>
            <h2> Bem vindo de volta!</h2>

            <div className='align-input'>
              <InputUser username={setUsername} valid={UserValid} setValid={setUserValid} tip='LoginTip'></InputUser>
              <InputPwd password={setPassword} valid={Pwd1Valid} setValid={setPwd1Valid} placeholder="Digite a senha" tip='LoginTip'></InputPwd>
            </div>

            <h3 id='LoginTip'> </h3>

            <button className='btn-login' onClick={checkIfLoginIsvalid}> Entrar </button>

            <p onClick={showLogin}> Cadastre-se </p>
            <p onClick={showRecovery}> Recuperar senha </p>
          </div>

          <div className='login-div' id='signupTab' style={{ display: 'none' }}>
            <h2> Junte-se a nós! </h2>

            <div className='align-input'>

              <InputUser username={setUsername} valid={UserValid} setValid={setUserValid} tip='SignTip'></InputUser>
              <InputEmail email={setEmail} valid={EmailValid} setValid={setEmailValid} tip='SignTip'></InputEmail>
              <InputPwd password={setPassword} valid={Pwd1Valid} setValid={setPwd1Valid} placeholder="Digite a senha" tip='SignTip'></InputPwd>
              <InputPwd password={setPwd} valid={Pwd2Valid} setValid={setPwd2Valid} placeholder="Comfirme a senha" tip='SignTip'></InputPwd>
              <InputQuestion question={setQuestion} valid={QuestionValid} setValid={setQuestionValid} tip='SignTip'></InputQuestion>
              <InputAnswer answer={setAnswer} valid={AnswerValid} setValid={setAnswerValid} tip='SignTip'></InputAnswer>

            </div>

            <h3 id='SignTip'> </h3>

            <button className='btn-login' onClick={checkIfSignIsValid}> Cadastrar </button>

            <p onClick={showLogin}> Entrar </p>
            <p onClick={showRecovery}> Recuperar senha </p>
          </div>
        </div>
      </div>
    </>
  )
}
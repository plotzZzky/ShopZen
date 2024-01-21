'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from "../../elements/navbar";
import InputPwd from '../../elements/inputs/inputPwd';
import InputUser from '../../elements/inputs/inputUser';
import InputAnswer from '../../elements/inputs/inputAnswer';


export default function Login() {
  const [getToken, setToken] = useState(typeof window !== 'undefined'? sessionStorage.getItem('token') : undefined);
  const [getVisibility, setVisibility] = useState(false)
  const router = useRouter();

  const [question, setQuestion] = useState("Digite o nome do usario para aparecer sua pergunta")
  const [getAnswer, setAnswer] = useState("");
  const [getUsername, setUsername] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getpwd, setPwd] = useState("")

  //Validate
  const [UserValid, setUserValid] = useState(false);
  const [Pwd1Valid, setPwd1Valid] = useState(false);
  const [Pwd2Valid, setPwd2Valid] = useState(false)
  const [AnswerValid, setAnswerValid] = useState(false)

  // Redireciona para a pagina de login
  function redirectToLogin() {
    router.push('/login');
  };

  // Função para verificar se o usuario terminou de digitar o username e então buscar a question
  function receiveQuestionTimer (value) {
    // Timer para buscar o username
    let timerId;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      receiveQuestion(value);
    }, 500);
  }

  // Função que busca a question do usuario para recuperar a senha
  function receiveQuestion(value) {
    const url = 'http://127.0.0.1:8000/users/question/'

    const formData = new FormData();
    formData.append("username", value || getUsername)
    const requestData = {method: 'POST', body: formData}

    fetch(url, requestData)
    .then((res) => res.json())
    .then((data) => {
      if (data.msg) {
        const tip = document.getElementById("recoveryTip")
        tip.innerText = data.msg
      } else {
        setQuestion(data['question'])
        setVisibility(true)
      }
    })
  };

  // Função de login
  function recoveyFunc() {
    const url = 'http://127.0.0.1:8000/users/recovery/'

    const formData = new FormData();
    formData.append("username", getUsername);
    formData.append("answer", getAnswer);
    formData.append("password", getPassword);
    formData.append("pwd", getpwd);

    const requestData = {method: 'POST', body: formData}

    fetch(url, requestData)
    .then((res) => res.json())
    .then((data) => {
      if (data.msg) {
        const tip = document.getElementById("recoveryTip")
        tip.innerText = data.msg
      } else {
        router.push('/login');
      }
    })
  }

  return (
    <>
    <NavBar></NavBar>
      <div className='page banner'>
        <div className="login-page">
        <div className="login-alert" id='loginAlert'>
            <a> Você precisa fazer login!</a>
          </div>
          <div className='login-div' id='signupTab'>
            <p className='login-title'> Recuperar senha </p>

            <div className='align-input'>
              <p> {question} </p>
              <InputUser username={setUsername} valid={UserValid} setValid={setUserValid} tip='recoveryTip' action={receiveQuestionTimer}></InputUser>
              <div style={{visibility: getVisibility? 'visible' : 'hidden'}}>
                <InputAnswer answer={setAnswer} valid={AnswerValid} setValid={setAnswerValid} tip='recoveryTip'></InputAnswer>
                <InputPwd password={setPassword} valid={Pwd1Valid} setValid={setPwd1Valid} placeholder="Digite a nova senha" tip='recoveryTip'></InputPwd>
                <InputPwd password={setPwd} valid={Pwd2Valid} setValid={setPwd2Valid} placeholder="Comfirme a nova senha" tip='recoveryTip'></InputPwd>
              </div>
            </div>

            <a className='login-tip' id='recoveryTip'> </a>

            <button className='btn btn-login' onClick={recoveyFunc}> Recuperar </button>

            <p className='login-link' onClick={redirectToLogin}> Entrar </p>
          </div>
        </div>
      </div>
    </>
  )
}
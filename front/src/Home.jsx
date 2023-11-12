import { useState } from 'react'
import NavBar from './elements/navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


export default function App() {
  const [getToken, setToken] = useState(sessionStorage.getItem('token')); 

  const faq = [
    { "question": "O que é o ShopZen?", 
      "answer": "O ShopZen é um site que oferece uma maneira fácil e eficaz de criar e gerenciar listas de compras. Além disso, ele possui uma funcionalidade exclusiva de controle de prazo de validade para ajudá-lo a evitar o desperdício de alimentos." },
    { "question": "Como faço para começar a usar o ShopZen?", 
      "answer": "Para começar a usar o ShopZen, você pode se registrar gratuitamente em nosso site. Depois de criar uma conta, você pode começar a criar suas listas de compras imediatamente." },
    { "question": "O ShopZen está disponível em dispositivos móveis?", 
      "answer": "Sim, o ShopZen é otimizado para dispositivos móveis. Você pode acessar suas listas de compras e controlar o prazo de validade dos produtos em qualquer lugar, a qualquer momento." },
    { "question": "O ShopZen é gratuito?", 
      "answer": "Sim, o ShopZen oferece uma versão gratuita que inclui recursos essenciais. Também temos planos premium com funcionalidades adicionais para quem deseja uma experiência ainda mais completa." },
    { "question": "Como faço para entrar em contato com o suporte do ShopZen se tiver alguma dúvida ou problema?", 
      "answer": "Para obter suporte, você pode entrar em contato conosco através da seção de Suporte em nosso site. Nossa equipe estará feliz em ajudar você com qualquer dúvida ou problema que possa ter." },
  ]

  const advantages = [
    '- Interface intuitiva que simplifica a criação e gestão de listas de compras.',
    '- Design responsivo que funciona perfeitamente em dispositivos móveis e desktops.',
    '- Contribua para um consumo mais consciente ao planejar suas compras com antecedência.',
    '- Equipe de suporte dedicada para ajudar em qualquer dúvida ou problema.'
  ]

  function go_to_login() {
    if (getToken == undefined) {
      location.href = "/site/login/"
    } else {
      location.href = "/site/shopping/"
    }
  }

  return (
    <>
      <NavBar></NavBar>

      <div className='page banner' id='Start'>
        <a className='big-title'> ShopZen <FontAwesomeIcon icon={faCartShopping} className='market-icon'/> </a><br/>
        <a className='subtitle'> Simplifique sua vida com uma lista de compras online!</a><br/>
        <div className='home-align-btn'>
          <button className='btn big-btn' onClick={go_to_login}> Começar! </button>
        </div>
      </div>

      <div className='page' id='AboutDiv'>
        <p className='title'> Sobre nós... </p>
        <p className='home-text'> Somos uma solução completa para listas de compras online. Com design intuitivo e funcionalidades poderosas, o ShopZen torna o processo de compras mais eficiente e organizado. Crie, compartilhe e gerencie suas listas de compras de maneira simples e conveniente.</p>
        <p className='title'> Vantagens </p>
        {advantages.map((data) => (
            <p className='home-text'> {data} </p>
        ))}
      </div>

      <div className='page' id='Faq'>
        <a className='title'> Duvias frequentes: </a>
        {faq.map((data) => (
          <details>
            <summary> {data.question} </summary>
            <p className='details-text'> {data.answer} </p>
          </details>
        ))}
      </div>
      <footer>
        <div>
          <a href='https://www.github.com/plotzzzky'> Plotzky </a>
          <FontAwesomeIcon icon={faGithub}/>
        </div>
        
        <div>
          <a href='https://www.github.com/plotzzzky'> Email </a>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>

      </footer>
    </>
  )
}
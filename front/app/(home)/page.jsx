'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [getToken, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);
  const router = useRouter();

  const FAQ = [
    {
      "question": "O que é o ShopZen?",
      "answer": "O ShopZen é um site que oferece uma maneira fácil e eficaz de criar e gerenciar listas de compras. Além disso, ele possui uma funcionalidade exclusiva de controle de prazo de validade para ajudá-lo a evitar o desperdício de alimentos."
    },
    {
      "question": "Como faço para começar a usar o ShopZen?",
      "answer": "Para começar a usar o ShopZen, você pode se registrar gratuitamente em nosso site. Depois de criar uma conta, você pode começar a criar suas listas de compras imediatamente."
    },
    {
      "question": "O ShopZen está disponível em dispositivos móveis?",
      "answer": "Sim, o ShopZen é otimizado para dispositivos móveis. Você pode acessar suas listas de compras e controlar o prazo de validade dos produtos em qualquer lugar, a qualquer momento."
    },
    {
      "question": "O ShopZen é gratuito?",
      "answer": "Sim, o ShopZen oferece uma versão gratuita que inclui recursos essenciais. Também temos planos premium com funcionalidades adicionais para quem deseja uma experiência ainda mais completa."
    },
    {
      "question": "Como faço para entrar em contato com o suporte do ShopZen se tiver alguma dúvida ou problema?",
      "answer": "Para obter suporte, você pode entrar em contato conosco através da seção de Suporte em nosso site. Nossa equipe estará feliz em ajudar você com qualquer dúvida ou problema que possa ter."
    },
  ]

  const BENEFITS = [
    '- Interface intuitiva que simplifica a criação e gestão de listas de compras.',
    '- Design responsivo que funciona perfeitamente em dispositivos móveis e desktops.',
    '- Contribua para um consumo mais consciente ao planejar suas compras com antecedência.',
    '- Equipe de suporte dedicada para ajudar em qualquer dúvida ou problema.'
  ]

  // Cria os items do faq
  const faqItems = () => {
    return FAQ.map((data, index) => (
      <details key={index}>
        <summary> {data.question} </summary>
        <a className='details-text'> {data.answer} </a>
      </details>
    ))
  }

  function goToLogin() {
    if (getToken !== null && typeof getToken === 'string') {
      router.push("/market");
    } else {
      router.push("/login");
    }
  }

  return (
    <>
      <div className='page-home banner' id='Start'>
        <h1 className='big-title'> ShopZen <FontAwesomeIcon icon={faCartShopping} className='market-icon' /> </h1>
        <h2 className='subtitle'> Simplifique sua vida com uma lista de compras online!</h2>

        <div className='home-align-btns'>
          <button onClick={goToLogin}> Começar! </button>
        </div>
      </div>

      <div className='page-home' id='About'>
        <h1> Sobre nós... </h1>
        <h2> Somos uma solução completa para listas de compras online. Com design intuitivo e funcionalidades poderosas, o ShopZen torna o processo de compras mais eficiente e organizado. Crie, compartilhe e gerencie suas listas de compras de maneira simples e conveniente.</h2>
        <h1> Por que usar... </h1>
        {
          BENEFITS.map((data) => (
            <p> {data} </p>
          ))
        }
      </div>

      <div className='page-home' id='Faq'>
        <h1> Duvias frequentes: </h1>
        {faqItems()}
      </div>
    </>
  )
}
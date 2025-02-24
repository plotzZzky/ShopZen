'use client'
import { useRouter } from 'next/navigation';
import { useAuth } from '@comps/authProvider';
import { handleLogin } from '@comps/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const { userProfile, setUserProfile } = useAuth();
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
  ];

  const faqItems = () => {
    // Cria os cards dos items da faq
    return FAQ.map(({question, answer}, index) => (
      <details key={index}>
        <summary> {question} </summary>
        <a className='details-text'> {answer} </a>
      </details>
    ))
  };

  function goLogin() {
    if (userProfile) {
      router.push("/shop")
    } else {
      handleLogin()
    };
  };


  return (
    <>
      <section id='Start'>
        <h1 className='big-title'> ShopZen <FontAwesomeIcon icon={faCartShopping} className='market-icon' /> </h1>
        <h2 className='subtitle'> Simplifique sua vida com uma lista de compras online!</h2>

        <div className='home-align-btns'>
          <button className="btn-home" onClick={goLogin}> Começar! </button>
        </div>
      </section>

      <section id='About'>
        <h1> Sobre nós... </h1>
        <h2> Somos uma solução completa para listas de compras online. Com design intuitivo e funcionalidades poderosas, o ShopZen torna o processo de compras mais eficiente e organizado. Crie, compartilhe e gerencie suas listas de compras de maneira simples e conveniente.</h2>
        <h2> ShopZen tambem ofere suporte a Dispensa, onde você poderá acompanhar a validade do seus items.</h2>
      </section>

      <section id='Faq'>
        <h1> Duvias frequentes: </h1>
        {faqItems()}
      </section>
    </>
  )
}
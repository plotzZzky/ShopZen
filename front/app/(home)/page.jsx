'use client'
import { useRouter } from 'next/navigation';
import { getUserJsonFromSupabase } from '@comps/supabase';
import NavBar from '@comps/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const userProfile = getUserJsonFromSupabase();
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

  const BENEFITS = [
    '- Interface intuitiva que simplifica a criação e gestão de listas de compras.',
    '- Design responsivo que funciona perfeitamente em dispositivos móveis e desktops.',
    '- Contribua para um consumo mais consciente ao planejar suas compras com antecedência.',
    '- Equipe de suporte dedicada para ajudar em qualquer dúvida ou problema.'
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

  const BENEFITSCARDS = () => {
    // Cria os cards dos beneficios de usar a shopzen
    return BENEFITS.map((value) => (
      <p> {value} </p>
    ))
  };

  function goToLogin() {
    // Função para redirecionar a pagina de login
    if (userProfile.jwt) {
      router.push("/market");
    } else {
      router.push("/login");
    };
  };

  return (
    <>
      <NavBar />

      <section id='Start'>
        <h1 className='big-title'> ShopZen <FontAwesomeIcon icon={faCartShopping} className='market-icon' /> </h1>
        <h2 className='subtitle'> Simplifique sua vida com uma lista de compras online!</h2>

        <div className='home-align-btns'>
          <button onClick={goToLogin}> Começar! </button>
        </div>
      </section>

      <section id='About'>
        <h1> Sobre nós... </h1>
        <h2> Somos uma solução completa para listas de compras online. Com design intuitivo e funcionalidades poderosas, o ShopZen torna o processo de compras mais eficiente e organizado. Crie, compartilhe e gerencie suas listas de compras de maneira simples e conveniente.</h2>
        <h1> Por que usar... </h1>

        {BENEFITSCARDS()}
      </section>

      <section id='Faq'>
        <h1> Duvias frequentes: </h1>
        {faqItems()}
      </section>
    </>
  )
}
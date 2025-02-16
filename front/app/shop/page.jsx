'use client'
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@comps/authProvider";
import { headers } from "@comps/headers";
import ShopBar from "@shop/shopBar";
import ShopCard from "@shop/shopCard";
import ModalNewCart from "@/app/comps/shop/modalNewCart";
import "../app.css"


export default function Shop() {
  const { userProfile, setUserProfile } = useAuth();
  const didMount = useRef(false); // Controla a primeira renderização

  const [getCards, setCards] = useState([]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

    if (userProfile?.jwt) {
      getAllCartsFromBackEnd();
    };

  }, [userProfile?.jwt]);

  async function getAllCartsFromBackEnd() {
    // Busca todas as listas de compras (carts) no backend
    if (userProfile?.token) {

      const url = process.env.NEXT_PUBLIC_SHOP_URL + `${userProfile.id}/`;

      const formData = {
        method: 'GET',
        headers: headers
      };

      try {
        const responde = await fetch(url, formData);

        if (!responde.ok) {
          throw new Error();
        };

        const data = await responde.json();
        createCartCards(data);

      } catch (error) {
        alert("Não foi possivel acessar o servidor!")
      };
    };
  };

  function createCartCards(value) {
    if (value) {
      setCards(
        value.map(({name, id}, index) => (
          <ShopCard key={index} name={name} id={id} delete={() => removeCartCard(index)}></ShopCard>
        ))
      );
    }
  };

  function removeCartCard(indexToRemove) {
    /**
     * Remove o cartCard do useState
     * @param {integer} indexToRemove - Index do cartCard a ser removido
     */
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );
  };

  return (
    <section>
      <ShopBar/>

      <div className='cards'>
        <a className="page-title"> Suas listas de compras </a>

        {getCards}

      </div>

      <ModalNewCart getAllCarts={getAllCartsFromBackEnd} />
    </section>
  )
}
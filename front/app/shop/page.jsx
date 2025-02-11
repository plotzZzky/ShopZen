'use client'
import { useState, useEffect, useRef } from "react";
import { getUserProfile } from "@comps/supabase";
import { useRouter } from "next/navigation";
import NavBar from "@comps/navbar";
import ShopBar from "@shop/shopBar";
import ShopCard from "@shop/shopCard";
import ModalNewCart from "@/app/comps/shop/modalNewCart";
import "../app.css"


export default function Shop() {
  const userProfile = getUserProfile();
  const router = useRouter();

  const didMount = useRef(false); // Controla a primeira renderização
  const [getCards, setCards] = useState([]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };
    
    checkLogin();
  }, []);

  function checkLogin() {
    if (!userProfile?.jwt) {
      router.push("");
    } else {
      getAllCartsFromBackEnd();
    };
  };

  async function getAllCartsFromBackEnd() {
    // Busca todas as listas de compras (carts) no back
    if (userProfile.token) {
      const url = `http://127.0.0.1:8000/shop/${userProfile.id}/`;

      const formData = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userProfile.jwt}`,
          Token: `Token ${userProfile.token}`
        },
      };

      try {
        const responde = await fetch(url, formData);
        if (!responde.ok) {
          throw new Error();
        }

        const data = await responde.json();
        createCartCards(data);

      } catch (error) {
        alert("Não foi possivel acessar o servidor!")
      }
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

  function removeCartCard(indexToRemove, itemID) {
    /**
     * Remove o cartCard do useState
     * @param {integer} indexToRemove - Index do cartCard a ser removido
     * @param {integer} itemID - ItemID do item selecionado
     */
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <NavBar appbar={<ShopBar/>}/>

        <div className='cards'>
          <a className="page-title"> Suas listas de compras </a>

          {getCards}

        </div>

        <ModalNewCart getAllCarts={getAllCartsFromBackEnd} />
    </>
  )
}
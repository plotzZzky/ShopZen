'use client'
import { useState, useEffect } from "react";
import { getUserJsonFromSupabase } from "@comps/supabase";
import { useRouter } from "next/navigation";
import NavBar from "@comps/navbar";
import ShopBar from "@shop/shopBar";
import CartCard from "@cart/cartCard";
import ModalNewCart from "@cart/modalNewCart";


export default function Shop() {
  const userProfile = getUserJsonFromSupabase();
  const [getCards, setCards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkLogin()
  }, []);

  function checkLogin() {
    if (!userProfile.jwt) {
      router.push("/login/");
    } else {
      getAllCartsFromBackEnd();
    };
  };

  function getAllCartsFromBackEnd() {
    // Busca todas as listas de compras (carts) no back
    if (userProfile.token) {
      const url = "http://127.0.0.1:8000/shop/cart/";

      const formData = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userProfile.jwt}`,
          Token: `Token ${userProfile.token}`
        },
      };

      fetch(url, formData)
        .then((res) => res.json())
        .then((data) => {
          createCartCards(data);
        });
    };
  };

  function createCartCards(value) {
    if (value) {
      setCards(
        value.map((data, index) => (
          <CartCard key={index} name={data.name} id={data.id} delete={() => removeCartCard(index, data.id)}></CartCard>
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

    removeCartFromBackEnd(itemID);
  };

  async function removeCartFromBackEnd(itemID) {
    /**
     * Envia a solicitação ao backend para deletar o cart
     * @param {integer} itemID - ID do item selecionado
     */
    const url = `http://127.0.0.1:8000/shop/${itemID}/`

    const requestData = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      }
    };

    await fetch(url, requestData);
  };

  return (
    <>
      <NavBar appbar={ShopBar}/>

      <div className='page banner'>
        <div className='cards'>
          <a className="page-title"> Suas listas de compras </a>

          {getCards}

        </div>

        <ModalNewCart getAllCarts={getAllCartsFromBackEnd} />
      </div>
    </>
  )
}
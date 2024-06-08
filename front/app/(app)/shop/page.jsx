'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@comps/authContext";
import CartBar from "@comps/cartBar";
import CartCard from "@comps/cartCard";
import ModalNewCart from "@comps/modalNewCart";


export default function Shop() {
  const [getToken, setToken] = useAuth();
  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");
  const router = useRouter();

  function checkLogin() {
    if (getToken === null && typeof getToken !== 'string') {
      router.push("/login/");
    }
  }

  function getAllCarts() {
    // Busca todas as listas de compras (carts) no back
    const url = "http://127.0.0.1:8000/shop/cart/";

    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + getToken },
    };

    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        createCartCards(data);
      });
  }

  function createCartCards(value) {
    if (value) {
      setCards() // Usado para forçar a renderização da nova lista
      setCards(
        value.map((data, index) => (
          <CartCard key={index} name={data.name} id={data.id} delete={() => removeShopCard(index)}></CartCard>
        ))
      );
    }
  }

  function removeShopCard(indexToRemove) {
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );
  }

  useEffect(() => {
    checkLogin()
    getAllCarts()
  }, []);

  return (
    <>
      <div className='page banner'>
        <div className='cards'>
          <CartBar market={setMarket} getCart={getAllCarts}></CartBar>
          <a className="page-title"> Suas listas de compras </a>
          {getCards}
        </div>
        
        <ModalNewCart getAllCarts={getAllCarts} ></ModalNewCart>
      </div>
    </>
  )
}
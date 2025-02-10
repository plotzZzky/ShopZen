'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserProfile } from "@comps/supabase";

import NavBar from "@comps/navbar";
import CartBar from "@cart/cartBar";
import ModalAdd from "@items/modalAddItem";
import ModalNewItem from "@items/modalNewItem";
import ShoppingCard from "@/app/comps/cart/cartCard";
import "../../app.css"


export default function Cart({ params }) {
  const userProfile = getUserProfile();
  const router = useRouter();

  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");
  const [getShowModal, setShowModal] = useState(false)
  const [getCartName, setCartName] = useState("Carregando...");

  useEffect(() => {
    checkLogin()
  }, []);

  function checkLogin() {
    if (!userProfile.jwt) {
      router.push("/login");
    } else {
      loadCartItems();
    }
  };

  function loadCartItems() {
    const cartName = `Cart ${params.id}`
    const cachedItems = sessionStorage.getItem(cartName)

    if (cachedItems) {
      createItemsCards(cachedItems);
    } else {
      getItemsFromBackEnd();
    }
  };

  function getItemsFromBackEnd() {
    // Busca a listas com os produtos deste carrinho no back
    if (userProfile.token && params.id) {  // Verifica se esta logado e se o CardId foi passado 
      const cartID = params.id
      const url = `http://127.0.0.1:8000/cart/${cartID}/`;

      const formnData = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userProfile.jwt}`,
          Token: `Token ${userProfile.token}`
        }
      };
      
      fetch(url, formnData)
        .then((res) => res.json())
        .then((data) => {
          saveItemsInSessionStorage(data.items, cartID);
          createItemsCards(data.items);
          setCartName(data.name);
        });
    }
  };

  function saveItemsInSessionStorage(value, cartID) {
    const name = `Cart ${cartID}`;
    sessionStorage.setItem(name, value);
  }
  
  function createItemsCards(value) {
    if (typeof value === Array) {
      setCards(
        value.map((data, index) => (
          <ShoppingCard 
            key={index} name={data.item.name} amount={data.amount} cartId={data.cart} 
            itemId={data.id} modelId={data.item.id} delete={() => removeItemCard(index, data.id)}>
          </ShoppingCard>
        ))
      );
    };
  };

  function removeItemCard(indexToRemove, itemID) {
    /**
     * Remove o card do item da lista
     * @param {integer} indexToRemove - Index do cardItem
     */
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );

    removeItemFromSessionStorage(itemID);
  };

  function removeItemFromSessionStorage(itemID) {
    /**
     * Remove o item selecionado do sessionStorage
     * @param {integer} itemID - O ID do item a ser removido
     */
    const cartName = `Cart ${params.id}`;
    const cachedItems = sessionStorage.getItem(cartName);

    if (cachedItems) {
      const jsonItems = JSON.parse(cachedItems);

      const updatedItems = jsonItems.filter(item => item.id !== itemID); // Retorna a lista com todos os items exceto o selecionado

      sessionStorage.setItem(cartName, updatedItems); // Salva a nova lista de items
    };

    removeItemFromBackEnd(itemID);
  };

  function removeItemFromBackEnd(itemID) {
    const url = `http://127.0.0.1:8000/shop/items/${itemID}/`;

    const requestData = {
      method: "DELETE",
      headers: {
        jwt: `Authorization ${userProfile.jwt}`,
        token: `Token ${userProfile.token}`
      }
    };

    fetch(url, requestData);
  };

  return (
    <>
      <NavBar appbar={<CartBar getCart={getItemsFromBackEnd}/>} />

      <div className='page banner'>
        <div className='cards'>
          <a className="page-title">{getCartName} </a>
          {getCards}
        </div>
        
        <ModalAdd getCart={getItemsFromBackEnd} show={getShowModal} setShow={setShowModal} market={getMarket} cartId={params.id}></ModalAdd>

        <ModalNewItem setShow={setShowModal} market={getMarket}></ModalNewItem>
      </div>
    </>
  )
}
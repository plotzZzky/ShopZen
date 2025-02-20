'use client'
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@comps/authProvider";
import { retrieveCartFromSessionStorage, removeItemFromSessionStorage, saveCartOnSessionStorage } from "@items/itemSS";
import { useHeaders } from "@comps/headers";
import ordeneItemsListByName from "@comps/utils"
import CartBar from "@cart/cartBar";
import ModalAddItem from "@items/modalAddItem";
import ModalCreateNewItem from "@items/modalNewItem";
import ItemCardCart from "@/app/comps/cart/itemCartCard";
import "@app/app.css"


export default function Cart({ params }) {
  const { userProfile, setUserProfile } = useAuth();
  const didMount = useRef(false); // Controla a primeira renderização
  const headers = useHeaders();

  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");
  const [getCartName, setCartName] = useState("Carregando...");

  const [getShowModalAddItem, setShowModalAddItem] = useState(false);
  const [getShowModalNewItem, setShowModalNewItem] = useState(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

    if (userProfile?.token) {
      loadCartItems();
    };

  }, [userProfile?.token]);


  function loadCartItems() {
    const cachedItems = retrieveCartFromSessionStorage(params.id);

    if (cachedItems) {
      createItemsCards(cachedItems);
    } else {
      getItemsFromBackEnd();
    };
  };

  function getItemsFromBackEnd() {
    // Busca a listas com os produtos deste carrinho no back
    if (userProfile.token && params.id) {  // Verifica se esta logado e se o CardId foi passado 
      const cartID = params.id
      const url = process.env.NEXT_PUBLIC_CART_URL + `${cartID}/`;

      const formnData = {
        method: 'GET',
        headers: headers
      };
      
      fetch(url, formnData)
        .then((res) => res.json())
        .then((data) => {
          createItemsCards(data);
          saveCartOnSessionStorage(data, cartID)
        });
    }
  };

  function createItemsCards(cart) {
    if (cart.items) {
      const ordened = cart.items.length > 1 ? ordeneItemsListByName(cart.items) : cart.items;

      setCards(
        ordened.map(({item, amount, cart, id,}, index) => (
          <ItemCardCart
            key={index}
            name={item.name}
            amount={amount}
            cartId={cart} 
            itemId={id}
            modelId={item.id} 
            delete={() => removeItemCard(index, id)}
          />
        ))
      );
    };

    if (cart.name) {
      setCartName(cart.name);
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

    removeItemFromSessionStorage(params.id, itemID)
    removeItemFromBackEnd(itemID);
  };

  function removeItemFromBackEnd(itemID) {
    const url = process.env.NEXT_PUBLIC_CART_URL + `${itemID}/`;

    const requestData = {
      method: "DELETE",
      headers: headers
    };

    fetch(url, requestData);
  };

  return (
    <section>
      <CartBar
        getCart={loadCartItems}
        showModalAddItem={setShowModalAddItem}
        showModalNewItem={setShowModalNewItem}
      />

      <div className='cards'>
        <a className="page-title">{getCartName} </a>

        {getCards}
        
      </div>
      
      <ModalAddItem createCards={loadCartItems} show={getShowModalAddItem} setShow={setShowModalAddItem} market={getMarket} cartId={params.id} />
      <ModalCreateNewItem show={getShowModalNewItem} setShow={setShowModalNewItem}/>
    </section>
  )
}
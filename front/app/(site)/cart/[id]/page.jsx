'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@comps/authContext";
import NavBar from "@comps/navbar";
import CartBar from "@comps/cart/cartBar";
import ModalAdd from "@comps/items/modalAddItem";
import ModalNewItem from "@comps/items/modalNewItem";
import ShoppingCard from "@comps/shop/shoppingCard";


export default function Cart({ params }) {
  const [getToken, setToken] = useAuth();
  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");
  const [getShowModal, setShowModal] = useState(false)
  const [getCartName, setCartName] = useState("");
  const router = useRouter();

  function checkLogin() {
    if (getToken === null && typeof getToken !== 'string') {
      router.push("/login/");
    } else {
      getCart()
    }
  }

  // Busca a listas com os produtos deste carrinho no back
  function getCart() {
    const url = `http://127.0.0.1:8000/shop/item/${params.id}/`;

    const data = {
      method: 'GET',
      headers: { Authorization: 'Token ' + getToken },
    };
    
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        createShoppingCards(data.items);
        setCartName(data.name)
      });
  }
  
  function createShoppingCards(value) {
    if (value) {
      setCards(
        value.map((data, index) => (
          <ShoppingCard 
            key={index} name={data.item.name} amount={data.amount} cartId={data.cart} 
            itemId={data.id} modelId={data.item.id} delete={() => removeShopCard(index)}>
          </ShoppingCard>
        ))
      );
    }
  }

  function removeShopCard(indexToRemove) {
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );
  }

  const APPBAR = () => {
    return <CartBar getCart={getCart}></CartBar>
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <NavBar appbar={APPBAR}></NavBar>

      <div className='page banner'>
        <div className='cards'>
          <a className="page-title">{getCartName} </a>
          {getCards}
        </div>
        
        <ModalAdd getCart={getCart} show={getShowModal} setShow={setShowModal} market={getMarket} cartId={params.id}></ModalAdd>

        <ModalNewItem setShow={setShowModal} market={getMarket}></ModalNewItem>
      </div>
    </>
  )
}
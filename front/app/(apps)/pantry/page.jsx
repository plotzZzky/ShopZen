'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@comps/authContext';
import PantryCard from '@/app/components/pantry/pantryCard';


export default function Pantry() {
  const [getToken, setToken] = useAuth();
  const [getItems, setItems] = useState([]);
  const [getCards, setCards] = useState([]);
  const [getMarket, setMarket] = useState("Mercado");

  const router = useRouter();

  // Verifica se possui o token, se não, redireciona para pagina de login
  function checkLogin() {
    if (getToken !== null && typeof getToken === 'string') {
      getPantryItems()
    } else {
      router.push("/login/");
    }
  }

  // Recebe a lista de items da dispensa do usuario
  function getPantryItems(market) {
    const url = "http://127.0.0.1:8000/shop/pantry/all/";
    const formData = new FormData();
    formData.append("market", market != undefined ? market : document.getElementById("selectMarket").value)

    const data = {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Token ' + getToken },
    };
    fetch(url, data)
      .then((res) => res.json())
      .then((data) => {
        createPantryCards(data);
      });
  }

  // Cria os cards dos items da dispensa recebidos do back
  function createPantryCards(value) {
    setCards(
      value.map((data, index) => (
        <PantryCard data={data} key={index} getItems={getPantryItems} delete={() => removePantryCard(index)}></PantryCard>
      ))
    );
  }

  function removePantryCard(indexToRemove) {
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <>
      <div className='page banner'>
        <div className='cards'>
          <a className="page-title"> Sua dispensa </a>
          {getCards}
        </div>
      </div>
    </>
  )
}

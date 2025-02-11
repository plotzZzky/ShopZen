'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@comps/supabase';
import NavBar from '@comps/navbar'
import PantryBar from '@pantry/pantryBar'
import PantryCard from '@pantry/pantryCard';


export default function Pantry() {
  const router = useRouter();
  const userProfile = getUserProfile();
  const didMount = useRef(false); // Controla a primeira renderização

  const [getCards, setCards] = useState([]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

  }, [userProfile.jwt]);

  function checkLogin() {
    if (!userProfile.jwt) {
      router.push("/login")
    }
      
    loadPantryItems();
  };

  function loadPantryItems() {
    const cachedPantry = sessionStorage.getItem("Pantry");

    if (cachedPantry) {
      createPantryCards(cachedPantry);
    } else {
      getPantryItemsFromBackEnd();
    };
  };

  function getPantryItemsFromBackEnd(market) {
    // Recebe a lista de items da dispensa do usuario
    if (userProfile.token) {
      const url = "http://127.0.0.1:8000/shop/pantry/";
    
      const formData = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userProfile.jwt}`,
          Token: `Token ${userProfile.token}`
        }
      };

      fetch(url, formData)
        .then((res) => res.json())
        .then((data) => {
          createPantryCards(data);
        });
    };
  };

  function createPantryCards(value) {
    // Cria os cards dos items da dispensa
    if (value) {
      setCards(
        value.map((data, index) => (
          <PantryCard data={data} key={index} getItems={getPantryItemsFromBackEnd} delete={() => removePantryCardFromList(index, data.id)}></PantryCard>
        ))
      );

      sessionStorage.setItem("Pantry", value);
    };
  };

  function removePantryCardFromList(indexToRemove, itemID) {
    /**
     * Remove o pantryCard da lista
     * @param {integer} indexToRemove - index do card a ser removido
     * @param {integer} itemID - ID do item a ser removido do sessionStorage
     */
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );

    removePantryItemFromSessionStorage(itemID)
  };

  function removePantryItemFromSessionStorage(itemID) {
    const cachedPantry = sessionStorage.getItem("Pantry")

    if (cachedPantry) {
      const jsonPantry = JSON.parse(cachedPantry);

      const updatedPantry = jsonPantry.filter(item => {item.id !== itemID})

      sessionStorage.setItem("Pantry", updatedPantry) // Salva a lista atualizada
    };

    removePantryItemFromBackEnd();
  };

  function removePantryItemFromBackEnd() {
    const url = "https://127.0.0.1:8000/pantry/"

    const requestData = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userProfile.jwt}`,
        Token: `Token ${userProfile.token}`
      },
    };

    fetch(url, requestData);
  };

  return (
    <>
      <PantryBar />

      <div className='cards'>
        <a className="page-title"> Sua dispensa </a>

        {getCards}
        
      </div>
    </>
  )
}

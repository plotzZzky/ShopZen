'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@comps/supabase';

import { headers } from '@comps/headers';
import PantryBar from '@pantry/pantryBar'
import PantryCard from '@pantry/pantryCard';
import { retrievePantryFromSessionStorage, removePantryItemFromSessionStorage } from '@pantry/pantrySS';


export default function Pantry() {
  const router = useRouter();
  const userProfile = getUserProfile();
  const didMount = useRef(false); // Controla a primeira renderização

  const [getMarket, setMarket] = useState("Mercado")
  const [pantryName, setPantryName] = useState("Carregando...");
  const [getCards, setCards] = useState([]);


  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

    checkLogin();
  }, [userProfile?.jwt]);

  function checkLogin() {
    if (!userProfile?.jwt) {
      router.push("/")
      
    } else {
      loadPantryItems();
    };
  };

  function loadPantryItems() {
    const cachedPantry = retrievePantryFromSessionStorage();

    if (cachedPantry) {
      createPantryCards(cachedPantry);

    } else {
      getPantryItemsFromBackEnd();
    };
  };

  function getPantryItemsFromBackEnd() {
    // Recebe a lista de items da dispensa do usuario
    if (userProfile.token) {
      const url = `http://127.0.0.1:8000/pantry/${userProfile.id}/`
    
      const formData = {
        method: 'GET',
        headers: headers
      };

      fetch(url, formData)
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem("Pantry", JSON.stringify(data));
          createPantryCards(data);
        });
    };
  };

  function createPantryCards(pantryItems) {
    // Cria os cards dos items da dispensa
    if (pantryItems) {
      const market = getMarket
      const filtered = pantryItems.filter(item => item.market === market);  // Somente cria os cards do market atual

      setCards(
        filtered.map(({item, id, date }, index) => (
          <PantryCard
            name={item.name}
            market={item.market}
            date={date}
            validate={item.validate}
            id={id}
            key={index}
            getItems={loadPantryItems}
            delete={() => removePantryCard(index, id)}
          />
        ))
      );

      setPantryName("Sua dispensa");
    };
  };

  function removePantryCard(indexToRemove, itemID) {
    /**
     * Remove o pantryCard da lista
     * @param {integer} indexToRemove - index do card a ser removido
     * @param {integer} itemID - ID do item a ser removido do sessionStorage
     */
    setCards((prevCards) =>
      prevCards.filter((card, index) => index !== indexToRemove)
    );

    removePantryItemFromSessionStorage(itemID);
    removePantryItemFromBackEnd(itemID);
  };

  function removePantryItemFromBackEnd(itemID) {
    const url = `http://127.0.0.1:8000/pantry/${itemID}/`

    const requestData = {
      method: "DELETE",
      headers: headers
    };

    fetch(url, requestData);
  };

  return (
    <>
      <PantryBar setMarket={setMarket} createCards={loadPantryItems} />

      <div className='cards'>
        <a className="page-title">{pantryName}</a>

        {getCards}
        
      </div>
    </>
  )
}

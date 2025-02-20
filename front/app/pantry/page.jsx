'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@comps/authProvider';
import { useHeaders } from '@comps/headers';
import ordeneItemsListByName from '@comps/utils';
import PantryBar from '@pantry/pantryBar'
import PantryCard from '@pantry/pantryCard';
import { retrievePantryFromSessionStorage, removePantryItemFromSessionStorage } from '@pantry/pantrySS';


export default function Pantry() {
  const headers = useHeaders();
  const { userProfile, setUserProfile } = useAuth();
  const didMount = useRef(false); // Controla a primeira renderização

  const [pantryName, setPantryName] = useState("Carregando...");
  const [getCards, setCards] = useState([]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Marcar que o componente foi montado
      return;
    };

    if (userProfile?.token) {
      loadPantryItems();
    };

  }, [userProfile?.token]);

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
      const url = process.env.NEXT_PUBLIC_PANTRY_URL;
    
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
      const market = document.getElementById("selectMarket").value // Necessario para evitar o delay de renderização do useState
      const filtered = pantryItems.filter(item => item.item.market === market);  // Somente cria os cards do market atual
      const ordened = ordeneItemsListByName(filtered);

      setCards(
        ordened.map(({item, id, date }, index) => (
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
    const url = process.env.NEXT_PUBLIC_PANTRY_URL + `${itemID}/`

    const requestData = {
      method: "DELETE",
      headers: headers
    };

    fetch(url, requestData);
  };

  return (
    <section>
      <PantryBar createCards={loadPantryItems} />

      <div className='cards'>
        <a className="page-title">{pantryName}</a>

        {getCards}
        
      </div>
    </section>
  )
}

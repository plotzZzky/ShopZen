export function retrievePantryFromSessionStorage() {
  /**
    * Retorna o json da Pantry do usuario
  */
  const cachedPantry = sessionStorage.getItem("Pantry");

  if (cachedPantry) {
    const pantry = JSON.parse(cachedPantry);

    return pantry;
  };
};


export function retrievePantryItemFromSessionStorage(itemID) {
  /**
   * Retorna um item da pantry 
  */
  const cachedPantry = retrievePantryFromSessionStorage();

  if (cachedPantry) {
    const item = cachedPantry.find(item => item.id === itemID)
    if (item) {
      return item;
    }
  };
};


export function savePantryItemOnSessionStorage(itemID, date) {
  /**
   * Salva o item com a data atualizada
  */
  const pantryItem = retrievePantryItemFromSessionStorage(itemID);

  if (pantryItem) {
    pantryItem.date = date;
    savePantryOnSessionStorage(pantryItem);
  };
};


export function savePantryOnSessionStorage(pantryItem) {
  const cachedPantry = retrievePantryFromSessionStorage();

  if (cachedPantry) {
    const updatedPantry = cachedPantry.filter(item => item.id !== pantryItem.id)

    updatedPantry.push(pantryItem);

    sessionStorage.setItem("Pantry", JSON.stringify(updatedPantry));
  };
};


export function removePantryItemFromSessionStorage(itemID) {
  /**
   * Remove um item da Pantry do usuario 
  */
  const cachedPantry = retrievePantryFromSessionStorage();

  if (cachedPantry) {

    const updatedPantry = cachedPantry.filter(item => item.id !== itemID)

    sessionStorage.setItem("Pantry", JSON.stringify(updatedPantry)) // Salva a lista atualizada
  };
};


export function saveNewPantryOnSessionStorage(pantry) {
  sessionStorage.setItem("Pantry", JSON.stringify(pantry));
};

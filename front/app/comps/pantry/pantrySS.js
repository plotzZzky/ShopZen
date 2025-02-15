export function retrievePantryFromSessionStorage() {
  /**
    * Retorna o json da Pantry do usuario
  */
  const cachedPantry = sessionStorage.getItem("Pantry");

  if (cachedPantry) {
    let pantry = cachedPantry ? JSON.parse(cachedPantry) : [];

    return pantry
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

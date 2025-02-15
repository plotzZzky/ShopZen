
export function createNewItemOnSessionSorage(cartID, itemID, newItem) {
  /**
   * Cria um novo cartItem no sessionStorage
   * @param {integer} cartID - O id do cart
   * @param {} newItem - O novo item a ser adicionado no cart 
  */
  const cart = retrieveCartFromSessionStorage(cartID);
  const item = retrieveItemFromCart(cart, itemID);

  if (item) {
    item.amount += 1;

  } else {
    cart.items.push(newItem);
  };

  saveCartOnSessionStorage(cart, cartID);
};


export function changeAmountOnSessionSorage(cartID, itemID, amount) {
  /**
   * Altera o valor de um item do cart no sessionStorage
  */
  const cart = retrieveCartFromSessionStorage(cartID);
  const item = retrieveItemByID(cart, itemID);

  if (item) {
    item.amount = parseInt(amount);
  }

  saveCartOnSessionStorage(cart, cartID);
};


export function removeItemFromSessionStorage(cartID, itemID) {
  /**
   * Remove o item selecionado do sessionStorage
   * @param {integer} itemID - O ID do item a ser removido
   */
  const cachedItems = retrieveCartFromSessionStorage(cartID);

  if (cachedItems) {

    const updatedItems = cachedItems.items.filter(item => item.id !== itemID); // Retorna a lista com todos os items exceto o selecionado

    cart.items = updatedItems; // Substitui a lista antiga pela atualizada

    sessionStorage.setItem(`Cart ${cartID}`, JSON.stringify(cart)); // Salva a nova lista de items
  };
};


export function retrieveCartFromSessionStorage(cartID) {
  /**
   * Retorna um cart
   * @param {integer} cartID - Id do cart a ser buscado
   */
  if (cartID) {
    const cartName = `Cart ${cartID}`
    const cart = sessionStorage.getItem(cartName);
    let parsedCart = cart ? JSON.parse(cart) : [];

    return parsedCart
  };
};


export function retrieveItemFromCart(cart, itemID) {
  /**
   * Retorna um item de um cart pelo ID do itemModel
   * @param {integer} cartID - Id do cart a ser buscado
   * @param {integer} itemID - Id do item a ser retornado
  */
  if (cart) {
    const item = cart.items.find(item => item.item.id === itemID);

    if (item) {
      return item;
    }
  };
};


export function retrieveItemByID(cart, itemID) {
  /**
   * Retorna um item de um cart pelo id do itemCart
   * @param {integer} cartID - Id do cart a ser buscado
   * @param {integer} itemID - Id do item a ser retornado
  */
  if (cart) {
    const item = cart.items.find(item => item.id === itemID);

    if (item) {
      return item;
    };
  };
};


export function saveCartOnSessionStorage(cart, cartID) {
  const cartName = `Cart ${cartID}`
  sessionStorage.setItem(cartName, JSON.stringify(cart));
};

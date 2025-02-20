export default function ordeneItemsListByName(items) {
  const ordened = items.sort((a, b) => {
    // Garantir que os nomes estejam sempre em string para evitar problemas de ordenação
    const nameA = (a.name || a.item.name).toLowerCase();
    const nameB = (b.name || b.item.name).toLowerCase();

    if (nameA < nameB) {
      return -1; // a vem antes de b
    }
    if (nameA > nameB) {
      return 1; // b vem antes de a
    }
    return 0; // se forem iguais
  });

  return ordened
};
const { itemNames, PersonalTable } = require('../../lumibot/__gamedata');

function getItemIdFromItemName(itemName) {
  if (!itemName) throw Error(`Bad item name: ${itemName}`);
  if (itemName === "King's Rock")
    return itemNames.labelDataArray.findIndex((e) => e.wordDataArray[0]?.str === 'King’s Rock');
  const index = itemNames.labelDataArray.findIndex((e) => e.wordDataArray[0]?.str === itemName);
  if (index === -1) throw Error(`Bad item name: ${itemName}`);
  return index;
}

function getItemString(itemId = 0) {
  return itemNames.labelDataArray[itemId].wordDataArray[0].str;
}

function getPokemonHeldItems(pokemonId = 0) {
  const p = PersonalTable.Personal[pokemonId];
  return [p.item1, p.item2, p.item3];
}

module.exports = { getItemIdFromItemName, getItemString, getPokemonHeldItems };
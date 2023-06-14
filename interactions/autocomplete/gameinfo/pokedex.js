const { DISPLAY_POKEMON_NAME_MAP } = require('../../../dex/name');
const { findClosestString } = require('../../../dex/fuzzy');
const POKEMON_NAME_LIST = Object.values(DISPLAY_POKEMON_NAME_MAP);

module.exports = {
  name: "pokedex",

  async execute(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();

    // Fuzzy search returns nothing when the input is empty. So we just send some default results.
    if (!focusedValue.trim()) {
      const defaultResults = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon"];

      // Respond with the default results.
      await interaction.respond(
        defaultResults.map((choice) => ({ name: choice, value: choice }))
      );

      return; // Exit the function after sending the default results.
    }

    // Runs a fuzzy search on the POKEMON_NAME_LIST.
    const closestNames = findClosestString(POKEMON_NAME_LIST, focusedValue || "", 5);

    // Respond with the fuzzy search results.
    await interaction.respond(
      closestNames.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
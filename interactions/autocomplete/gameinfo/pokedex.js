const {POKEMON_NAME_MAP} = require('../../../dex/name');
const {findClosestString} = require('../../../dex/levenshtein');
const POKEMON_NAME_LIST = Object.values(POKEMON_NAME_MAP);

module.exports = {
	name: "pokedex",

	async execute(interaction) {
		// Preparation for the autocomplete request.

		const focusedValue = interaction.options.getFocused().toLowerCase();

		//We don't want empty values reaching the autocomplete code.
		if(!focusedValue.trim()) return;

		//Find the closest name to the input by Levenshtein Distance https://en.wikipedia.org/wiki/Levenshtein_distance
		const closestNames = findClosestString(POKEMON_NAME_LIST, focusedValue || "", 5);

		// Respond to the request here.
		await interaction.respond(
			closestNames.map((choice) => ({ name: choice, value: choice }))
		);
	},
};
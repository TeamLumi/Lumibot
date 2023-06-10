const { basePokemonNames } = require('../../../__gamedata');

module.exports = {
	name: "pokedex",

	async execute(interaction) {
		// Preparation for the autocomplete request.

		const focusedValue = interaction.options.getFocused().toLowerCase();

		// Extract choices automatically from your choice array (can be dynamic too)!

		const choices = basePokemonNames.labelDataArray
      .map((data) => data.wordDataArray[0]?.str)
      .filter((name) => name !== undefined)

		// Filter choices according to user input.

		const filtered = choices.filter((choice) =>
			choice.toLowerCase().startsWith(focusedValue)
		);

    // Limit the number of options to 25.
    const limitedChoices = filtered.slice(0, 25);

    // Respond to the request here.
    await interaction.respond(
      limitedChoices.map((choice) => ({ name: choice, value: choice }))
    );

		return;
	},
};
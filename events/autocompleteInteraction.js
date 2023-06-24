module.exports = {
	name: "interactionCreate",

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @param {import('discord.js').AutocompleteInteraction & { client: import('../typings').Client }} interaction The interaction which was created
	 */
	async execute(interaction) {
		const { client } = interaction;
		if (!interaction.isAutocomplete()) return;

		const request = client.autocompleteInteractions.get(
			interaction.commandName,
		);

		if (!request) return;

		try {
			await request.execute(interaction);
		} catch (err) {
			console.error(err);
		}
		return;
	},
};

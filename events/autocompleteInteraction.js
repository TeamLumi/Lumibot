module.exports = {
	name: "interactionCreate",

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

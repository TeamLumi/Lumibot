module.exports = {
	name: "interactionCreate",

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @param {import('discord.js').SelectMenuInteraction & { client: import('../typings').Client }} interaction The interaction which was created
	 */
	async execute(interaction) {
		const { client } = interaction;
		if (!interaction.isAnySelectMenu()) return;

		const command = client.selectCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// We can modify the error message at ./messages/defaultSelectError.js file!

		if (!command) {
			await require("../messages/defaultSelectError").execute(interaction);
			return;
		}

		try {
			await command.execute(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that select menu option!",
				ephemeral: true,
			});
			return;
		}
	},
};

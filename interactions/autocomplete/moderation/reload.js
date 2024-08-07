/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "reload",

	async execute(interaction) {
		const { client } = interaction;
		const focusedValue = interaction.options.getFocused().toLowerCase();
		let slashCommandNames = [...client.slashCommands.keys()];

		slashCommandNames.push("new", "triggers");

		const filteredCommands = slashCommandNames
			.filter(commandName => commandName.toLowerCase().includes(focusedValue))
			.slice(0, 5);

		await interaction.respond(
			filteredCommands.map(commandName => ({
				name: commandName,
				value: commandName,
			})),
		);
	},
};

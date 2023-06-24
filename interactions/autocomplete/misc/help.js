/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "help",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		// Extract choices automatically from our array of commands. Then filter.

		const choices = interaction.client.slashCommands
			.filter((command) => command.data && command.data.name)
			.filter((command) => !shouldExcludeCommand(command))
			.map((command) => command.data.name);

		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue),
		);
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice })),
		);

		return;
	},
};

function shouldExcludeCommand(command) {
	return command.data.name === "amicute";
}

module.exports = {
	name: "help",

	async execute(interaction) {
		// Preparation for the autocomplete request.

		const focusedValue = interaction.options.getFocused().toLowerCase();

		// Extract choices automatically from your choice array (can be dynamic too)!

		const choices = interaction.client.slashCommands
			.filter((command) => command.data && command.data.name)
			.filter((command) => !shouldExcludeCommand(command))
			.map((command) => command.data.name);

		// Filter choices according to user input.

		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue),
		);

		// Respond the request here.
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice })),
		);

		return;
	},
};

function shouldExcludeCommand(command) {
	return command.data.name === "amicute";
}

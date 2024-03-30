/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "help",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		let choices = ["tags"];

		choices.push(
			...interaction.client.slashCommands
				.filter(command => command.data && command.data.name)
				.filter(command => !shouldExcludeCommand(command))
				.filter(command => {
					// Check if the command has specific member permissions defined and filter out.
					const requiredPermissions = command.data.default_member_permissions;
					if (requiredPermissions)
						return interaction.member.permissions.has(requiredPermissions);
					return true;
				})
				.map(command => command.data.name),
		);

		choices = choices.filter(choice => choice.includes(focusedValue));

		if (choices.length > 5) choices = choices.slice(0, 5);

		await interaction.respond(
			choices.map(choice => ({ name: choice, value: choice })),
		);
	},
};

function shouldExcludeCommand(command) {
	return (
		command.data.name === "amicute" || command.data.name === "someOtherCommand"
	);
}

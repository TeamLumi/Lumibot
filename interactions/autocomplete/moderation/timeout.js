/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "timeout",

	async execute(interaction) {
		// Will populate autocomplete with cached members. Non-cached members can still be explicitly called.
		const guildMembers = interaction.guild.members.cache;
		const userNames = guildMembers.map((member) => member.user.username);

		await interaction.respond(
			userNames.map((userName) => ({ name: userName, value: userName })),
		);
	},
};

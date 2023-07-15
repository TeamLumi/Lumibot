/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "avatar",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		interaction.guild.members
			.fetch()
			.then(async (members) => {
				let guildUsers = members.filter(
					(member) =>
						member.user.username.includes(focusedValue) &&
						member.id !== interaction.member.id &&
						member.id !== interaction.client.user.id &&
						interaction.member.roles.highest.comparePositionTo(
							member.roles.highest,
						) > 0,
				);

				if (guildUsers.size > 5) {
					guildUsers = guildUsers.first(5);
				}

				await interaction.respond(
					guildUsers.map((member) => ({
						name: member.user.username,
						value: member.user.username,
					})),
				);
			})
			.catch((error) => {
				console.error(`Failed to fetch guild members: ${error}`);
			});
	},
};

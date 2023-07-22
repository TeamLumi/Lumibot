/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "unban",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		interaction.guild.bans
			.fetch()
			.then(async (members) => {
				let guildUsers = members.filter((member) =>
					member.user.username.toLowerCase().includes(focusedValue),
				);

				if (guildUsers.size > 5) {
					guildUsers = guildUsers.first(5);
				}

				await interaction.respond(
					guildUsers.map((member) => ({
						name: member.nickname
							? `${member.nickname}/${member.user.username}`
							: member.user.username,
						value: member.user.username,
					})),
				);
			})
			.catch((error) => {
				console.error(`Failed to fetch guild members: ${error}`);
			});
	},
};

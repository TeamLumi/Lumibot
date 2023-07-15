/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "unban",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		interaction.guild.bans
			.fetch()
			.then(async (bans) => {
				if (bans.size === 0) {
					const defaultResults = ["There are no banned users."];
					await interaction.respond(
						defaultResults.map((choice) => ({ name: choice, value: choice })),
					);
					return;
				}

				let bannedUsers = bans.filter((ban) =>
					ban.user.username.includes(focusedValue),
				);

				if (bannedUsers.length > 5) {
					bannedUsers = bannedUsers.slice(0, 5);
				}

				await interaction.respond(
					bannedUsers.map((ban) => ({
						name: ban.user.username,
						value: ban.user.username,
					})),
				);
			})
			.catch((error) => {
				console.error(`Failed to fetch bans: ${error}`);
			});
	},
};

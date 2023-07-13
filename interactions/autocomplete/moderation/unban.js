/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "ban",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		interaction.guild.bans
			.fetch()
			.then(async (bans) => {
				// Filter the bans based on the focused value - NOT WORKING
				const filteredBans = bans.filter((ban) =>
					ban.user.username.toLowerCase().includes(focusedValue),
				);

				await interaction.respond(
					filteredBans.map((ban) => ({
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

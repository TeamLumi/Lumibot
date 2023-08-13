module.exports = {
	name: "timeout",

	async execute(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const cachedMembers = interaction.guild.members.cache;

		let guildUsers = cachedMembers.filter(
			(member) =>
				(member.nickname &&
					member.nickname.toLowerCase().includes(focusedValue)) ||
				(member.user.username.toLowerCase().includes(focusedValue) &&
					member.id !== interaction.member.id &&
					member.id !== interaction.client.user.id &&
					interaction.member.roles.highest.comparePositionTo(
						member.roles.highest,
					) > 0),
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
	},
};

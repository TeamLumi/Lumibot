const {
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Moderator Command: Unbans a user")
		.addStringOption(option =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const userName = interaction.options.getString("user");

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to unban users.`,
				ephemeral: true,
			});
		}

		if (
			!interaction.guild.members.me.permissions.has(
				PermissionsBitField.Flags.BanMembers,
			)
		) {
			return interaction.reply({
				content: `I don't have permission to unban users.`,
				ephemeral: true,
			});
		}

		interaction.reply({
			content: `Unbanning user...`,
			ephemeral: true,
		});

		try {
			const bannedUsers = await interaction.guild.bans.fetch();
			const member = bannedUsers.find(ban => ban.user.username === userName);

			if (!member)
				return interaction.editReply({
					content: `Sorry! I couldn't find that member.`,
				});
			await interaction.guild.members.unban(member.user);

			interaction.editReply({
				content: `> ${member.user.username} just got unbanned.`,
			});
		} catch (error) {
			console.error(`Failed to unban member:`, error);
			interaction.editReply({
				content: `An issue occured unbanning that user. Consult the logs for more info.`,
			});
		}
	},
};

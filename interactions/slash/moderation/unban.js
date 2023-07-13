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
		.addStringOption((option) =>
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

		interaction.guild.bans
			.fetch({ query: userName, limit: 1 })
			.then(async (members) => {
				const member = members.first();
				if (!member) {
					return interaction.reply({
						content: `Sorry! I couldn't find that member.`,
						ephemeral: true,
					});
				}
				try {
					await interaction.guild.members.unban(member.user);
					const embed = new EmbedBuilder()
						.setTitle(`Member Unbanned`)
						.setDescription(`> ${member.user.username} just got unbanned.`)
						.setColor("#00ff00")
						.setFooter({
							text: `Requested by ${interaction.member.user.username}`,
							iconURL: interaction.member.user.displayAvatarURL(),
						});

					interaction.reply({
						embeds: [embed],
					});
				} catch (error) {
					console.error(`Failed to unban member:`, error);
					interaction.reply({
						content: `An issue occured unbanning that user. Consult the logs for more info.`,
						ephemeral: true,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				return interaction.reply({
					content: `Sorry! An error occurred. Consult the logs for more info.`,
					ephemeral: true,
				});
			});
	},
};

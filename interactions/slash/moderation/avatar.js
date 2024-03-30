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
		.setName("avatar")
		.setDescription("Moderator Command: Gets the avatar of a user.")
		.addStringOption(option =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const userName = interaction.options.getString("user");

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to get user avatars.`,
				ephemeral: true,
			});
		}

		interaction.guild.members
			.fetch({ query: userName, limit: 1 })
			.then(async members => {
				const member = members.first();
				if (!member)
					return interaction.reply({
						content: `Sorry! I couldn't find that member.`,
						ephemeral: true,
					});

				const avatar = member.user.displayAvatarURL({
					size: 1024,
					dynamic: true,
				});

				const embed = new EmbedBuilder()
					.setTitle(`${member.user.username}'s Avatar`)
					.setImage(avatar)
					.setColor(0x000000)
					.setFooter({
						text: `Requested by ${interaction.member.user.username}`,
						iconURL: interaction.member.user.displayAvatarURL(),
					});

				interaction.reply({
					embeds: [embed],
				});
			})
			.catch(error => {
				console.log(error);
				return interaction.reply({
					content: `Sorry! An error occurred. Consult the logs for more info.`,
					ephemeral: true,
				});
			});
	},
};

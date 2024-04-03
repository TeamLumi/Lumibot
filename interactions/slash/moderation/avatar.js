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
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true),
		)
		//.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const user = interaction.options.getUser("user");

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to get user avatars.`,
				ephemeral: true,
			});
		}

		const avatar = user.displayAvatarURL({
			size: 1024,
			dynamic: true,
		});

		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s Avatar`)
			.setImage(avatar)
			.setColor(0x000000)
			.setFooter({
				text: `Requested by ${interaction.member.user.username}`,
				iconURL: interaction.member.user.displayAvatarURL(),
			});

		interaction.reply({
			embeds: [embed],
		});
	},
};

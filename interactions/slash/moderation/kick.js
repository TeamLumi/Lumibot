const {
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
	ChannelType,
} = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Moderator Command: Kicks a user")
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("Reason for the kick")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("deletemessages")
				.setDescription("Users messages to be deleted")
				.setRequired(false)
				.addChoices({ name: "No", value: "0" }, { name: "Yes", value: "86400" }),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const user = interaction.options.getUser("user");
		const providedReason = interaction.options.getString("reason");
		const kickReason = providedReason || "No reason provided.";
		const deleteMessages = interaction.options.getString("deletemessages");
		const deleteSeconds = deleteMessages || "86400";
		let member = null;

		try {
			member = interaction.guild.members.cache.get(user.id);
		} catch (error) {
			console.error(`Failed to get associated guild member:`, error);
			interaction.reply({
				content: `Couldn't get the associated guild member. They may already have been kicked or left.`,
				ephemeral: true,
			});
		}

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to kick users.`,
				ephemeral: true,
			});
		}

		if (
			!interaction.guild.members.me.permissions.has(
				PermissionsBitField.Flags.KickMembers,
			)
		) {
			return interaction.reply({
				content: `I don't have permission to kick users.`,
				ephemeral: true,
			});
		}

		if (user.id === "1115351318740095058")
			return interaction.reply({
				content: `I can't kick myself!`,
				ephemeral: true,
			});

		if (interaction.member.id === user.id)
			return interaction.reply({
				content: `I can't kick you.`,
				ephemeral: true,
			});

		const targetHighestRole = member.roles.highest;
		const userHighestRole = interaction.member.roles.highest;
		const botHighestRole = interaction.guild.members.me.roles.highest;

		if (userHighestRole.comparePositionTo(targetHighestRole) <= 0)
			return interaction.reply({
				content: `Your permissions are less than or equal to the user you are trying to kick.`,
				ephemeral: true,
			});

		if (botHighestRole.comparePositionTo(targetHighestRole) <= 0)
			return interaction.reply({
				content: `My permissions are less than or equal to the user you are trying to ban.`,
				ephemeral: true,
			});

		interaction.reply({
			content: `Kicking user...`,
			ephemeral: true,
		});

		try {
			await member.ban({
				deleteMessageSeconds: deleteSeconds,
				reason: kickReason,
			});

			await interaction.guild.members.unban(user);

			interaction.editReply({
				content: `> ${user.username} just got kicked. For reason: ${kickReason}`,
			});
		} catch (error) {
			console.error(`Failed to kick member:`, error);
			interaction.editReply({
				content: `An issue occured kicking that user. Consult the logs for more info.`,
			});
		}
	},
};

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
		.setName("ban")
		.setDescription("Moderator Command: Bans a user")
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("Reason for the ban")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("deletemessages")
				.setDescription("Users messages to be deleted")
				.setRequired(false)
				.addChoices({ name: "No", value: "0" }, { name: "Yes", value: "86400" }),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const user = interaction.options.getUser("user");
		const providedReason = interaction.options.getString("reason");
		const banReason = providedReason || "No reason provided.";
		const deleteMessages = interaction.options.getString("deletemessages");
		const deleteSeconds = deleteMessages || "86400";
		let member = null;

		try {
			member = interaction.guild.members.cache.get(user.id);
		} catch (error) {
			console.error(`Failed to get associated guild member:`, error);
			interaction.reply({
				content: `Couldn't get the associated guild member. They may already have been banned or left.`,
				ephemeral: true,
			});
		}

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to ban users.`,
				ephemeral: true,
			});
		}

		if (
			!interaction.guild.members.me.permissions.has(
				PermissionsBitField.Flags.BanMembers,
			)
		) {
			return interaction.reply({
				content: `I don't have permission to ban users.`,
				ephemeral: true,
			});
		}

		if (user.id === "1115351318740095058")
			return interaction.reply({
				content: `I can't ban myself!`,
				ephemeral: true,
			});

		if (interaction.member.id === user.id)
			return interaction.reply({
				content: `I can't ban you.`,
				ephemeral: true,
			});

		// Role hierarchy checks if the user is still in the guild
		if (member) {
			const targetHighestRole = member.roles.highest;
			const userHighestRole = interaction.member.roles.highest;
			const botHighestRole = interaction.guild.members.me.roles.highest;

			if (userHighestRole.comparePositionTo(targetHighestRole) <= 0) {
				return interaction.reply({
					content: `Your permissions are less than or equal to the user you are trying to ban.`,
					ephemeral: true,
				});
			}

			if (botHighestRole.comparePositionTo(targetHighestRole) <= 0) {
				return interaction.reply({
					content: `My permissions are less than or equal to the user you are trying to ban.`,
					ephemeral: true,
				});
			}
		}

		// Notify the user that the ban process is starting
		await interaction.reply({
			content: `Banning user...`,
			ephemeral: true,
		});

		// Try to DM the user about the ban (if they're not a bot)
		if (!user.bot) {
			try {
				if (banReason.trim().toLowerCase() === "rule 0" || banReason.trim().toLowerCase() === "rule0") {
					const dmMessage = `You have been banned from the Team Luminescent server | Reason: Rule 0\n\nPokémon Luminescent Platinum is a romhack that requires Brilliant Diamond 1.3.0 to work. You must legally own and acquire your own copy of the game. If you cannot dump the files from a hacked Nintendo Switch, then they are not considered legal!\n\n**NO PIRACY IS ALLOWED IN THE SERVER, EVER, FOR ANY REASON. THIS INCLUDES ALLUDING TO OR IMPLYING YOUR PIRACY OR ASKING FOR: THE ROMS, NSP, XCI, UPDATE FILES, GAMES, FIRMWARE, SHADER CACHES OR KEYS, OR WHERE TO FIND THEM.**`;
					await user.send(dmMessage);
				} else if (banReason !== "No reason provided.") {
					const dmMessage = `You have been banned from the Team Luminescent server | Reason: ${banReason}`;
					await user.send(dmMessage);
				}
			} catch (error) {
				console.log(`Failed to send DM to user:`, error);
			}
		}

		// Attempt to ban the user
		try {
			await interaction.guild.bans.create(user, {
				deleteMessageSeconds: deleteSeconds,
				reason: banReason,
			});

			await interaction.editReply({
				content: `> ${user.username} just got banned. Reason: ${banReason}`,
			});
		} catch (error) {
			console.error(`Failed to ban user:`, error);
			await interaction.editReply({
				content: `An issue occurred while banning the user. Consult the logs for more info.`,
			});
		}
	},
};

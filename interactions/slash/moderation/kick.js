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
		.setName("kick")
		.setDescription("Moderator Command: Kicks a user")
		.addStringOption((option) =>
			option
				.setName("user")
				.setDescription("The name of the User")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for the kick")
				.setRequired(false),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const userName = interaction.options.getString("user");
		const providedReason = interaction.options.getString("reason");
		const kickReason = providedReason || "No reason provided.";

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

		interaction.guild.members
			.fetch({ query: userName, limit: 1 })
			.then(async (members) => {
				const member = members.first();
				if (!member) {
					return interaction.reply({
						content: `Sorry! I couldn't find that member.`,
						ephemeral: true,
					});
				}

				if (member.id === "1115351318740095058") {
					return interaction.reply({
						content: `I can't kick myself!`,
						ephemeral: true,
					});
				}

				if (interaction.member.id === member.id) {
					return interaction.reply({
						content: `I can't kick you.`,
						ephemeral: true,
					});
				}

				const targetHighestRole = member.roles.highest;
				const userHighestRole = interaction.member.roles.highest;
				const botHighestRole = interaction.guild.members.me.roles.highest;

				if (userHighestRole.comparePositionTo(targetHighestRole) <= 0) {
					return interaction.reply({
						content: `Your permissions are less than or equal to the user you are trying to kick.`,
						ephemeral: true,
					});
				}

				if (botHighestRole.comparePositionTo(targetHighestRole) <= 0) {
					return interaction.reply({
						content: `My permissions are less than or equal to the user you are trying to ban.`,
						ephemeral: true,
					});
				}

				try {
					await member.kick({
						reason: kickReason,
					});
					const embed = new EmbedBuilder()
						.setTitle(`Member Kicked`)
						.setDescription(
							`> ${member} just got kicked. For reason: ${kickReason}`,
						)
						.setColor("#00ff00")
						.setFooter(`Requested by ${interaction.author.username}`)
						.setTimestamp();

					interaction.channel.send({
						embeds: [embed],
					});
				} catch (error) {
					console.error(`Failed to kick member:`, error);
					interaction.reply({
						content: `An issue occured kicking that user. Consult the logs for more info.`,
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

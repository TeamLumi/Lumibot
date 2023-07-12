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
		.setName("ban")
		.setDescription("Moderator Command: Bans a user")
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
				.setDescription("Reason for the ban")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("deletemessages")
				.setDescription("Users messages to be deleted")
				.setRequired(false)
				.addChoices(
					{ name: "None", value: "0" },
					{ name: "Past Day", value: "1" },
					{ name: "Past Week", value: "7" },
				),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const userName = interaction.options.getString("user");
		const providedReason = interaction.options.getString("reason");
		const banReason = providedReason || "No reason provided.";
		const deleteMessages = interaction.options.getString("deletemessages");
		const deleteDays = deleteMessages || "0";

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to ban users.`,
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
						content: `I can't ban myself!`,
						ephemeral: true,
					});
				}

				if (interaction.member.id === member.id) {
					return interaction.reply({
						content: `I can't ban you.`,
						ephemeral: true,
					});
				}

				const targetHighestRole = member.roles.highest;
				const userHighestRole = interaction.member.roles.highest;

				if (userHighestRole.comparePositionTo(targetHighestRole) <= 0) {
					return interaction.reply({
						content: `Your permissions are less than or equal to the user you are trying to ban.`,
						ephemeral: true,
					});
				}

				try {
					await member.ban({
						days: deleteDays,
						reason: banReason,
					});
					const embed = new EmbedBuilder()
						.setTitle(`Member Banned`)
						.setDescription(
							`> ${member} just got banned. For reason: ${banReason}`,
						)
						.setColor("#00ff00")
						.setFooter(`Requested by ${interaction.author.username}`)
						.setTimestamp();

					interaction.channel.send({
						embeds: [embed],
					});
				} catch (error) {
					console.error(`Failed to ban member:`, error);
					interaction.reply({
						content: `Failed to ban the member. I may not have permission to ban users.`,
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

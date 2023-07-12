const {
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} = require("discord.js");

function formatDuration(milliseconds) {
	const seconds = Math.floor((milliseconds / 1000) % 60);
	const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
	const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
	const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

	const parts = [];
	if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
	if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
	if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
	if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

	return parts.join(", ");
}

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Moderator Command: Times out a user (for an hour default)")
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
				.setDescription("Reason for the timeout")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("duration")
				.setDescription("Duration of the timeout")
				.setRequired(false)
				.addChoices(
					{ name: "10 minutes", value: "10" },
					{ name: "30 minutes", value: "30" },
					{ name: "1 hour (default)", value: "60" },
					{ name: "3 hours", value: "180" },
					{ name: "1 day", value: "1440" },
					{ name: "0 (end timeout)", value: "0" },
				),
		)
		.addStringOption((option) =>
			option
				.setName("customduration")
				.setDescription("Custom duration for timeout in minutes")
				.setRequired(false),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
		.setDMPermission(false),

	async execute(interaction) {
		const userName = interaction.options.getString("user");
		const providedReason = interaction.options.getString("reason");
		const timeoutReason = providedReason || "No reason provided.";
		const providedDuration = interaction.options.getString("duration");
		const customDuration = interaction.options.getString("customduration");
		const timeoutDuration = customDuration || providedDuration || "60";

		const timeoutMS = parseInt(timeoutDuration) * 60000;
		const prettyDuration = formatDuration(timeoutMS);

		if (
			!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)
		) {
			return interaction.reply({
				content: `You don't have permission to timeout users.`,
				ephemeral: true,
			});
		}

		if ((timeoutMS !== 0 && timeoutMS < 5000) || timeoutMS > 2.419e9) {
			return interaction.reply({
				content: `That's not a valid timeout duration.\n\nTimeout must be longer than 5 seconds and shorter than 28 days.`,
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
						content: `I can't timeout myself!`,
						ephemeral: true,
					});
				}

				if (interaction.member.id === member.id) {
					return interaction.reply({
						content: `I can't time you out.`,
						ephemeral: true,
					});
				}

				const targetHighestRole = member.roles.highest;
				const userHighestRole = interaction.member.roles.highest;

				if (userHighestRole.comparePositionTo(targetHighestRole) <= 0) {
					return interaction.reply({
						content: `Your permissions are less than or equal to the user you are trying to timeout.`,
						ephemeral: true,
					});
				}

				if (timeoutMS === 0) {
					try {
						await member.timeout(null);
						const embed = new EmbedBuilder()
							.setTitle(`Timeout ended`)
							.setDescription(`> ${member}'s timeout has been ended.`)
							.setColor("#00ff00")
							.setFooter(`Requested by ${interaction.author.username}`)
							.setTimestamp();

						return interaction.channel.send({
							embeds: [embed],
						});
					} catch (error) {
						console.error(`Failed to end timeout:`, error);
						return interaction.reply({
							content: `Failed to end timeout. I may not have permission to timeout users.`,
							ephemeral: true,
						});
					}
				}

				try {
					await member.timeout(timeoutMS, timeoutReason);
					const embed = new EmbedBuilder()
						.setTitle(`Member Timed Out`)
						.setDescription(
							`> ${member} just got Timed Out for ${prettyDuration}.\n\nFor reason: ${timeoutReason}`,
						)
						.setColor("#00ff00")
						.setFooter(`Requested by ${interaction.author.username}`)
						.setTimestamp();

					interaction.channel.send({
						embeds: [embed],
					});
				} catch (error) {
					console.error(`Failed to timeout member:`, error);
					interaction.reply({
						content: `Failed to timeout the member. I may not have permission to timeout users.`,
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

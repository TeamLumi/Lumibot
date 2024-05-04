const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { GuildConfig } = require("../../../keys.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("whitelist")
		.setDescription(
			"Moderator Command: Base command for whitelisting server roles",
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Whitelist subcommand to make a role exempt from spam")
				.addRoleOption(option =>
					option
						.setName("target")
						.setDescription("Select a role here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Whitelist subcommand to remove a roles spam exemption")
				.addRoleOption(option =>
					option
						.setName("target")
						.setDescription("Select a role here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Whitelist subcommand to list all whitelisted roles"),
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const targetRole = interaction.options.getRole("target");

		try {
			let guildConfig = await GuildConfig.findOne({
				guildId: interaction.guild.id,
			});

			if (!guildConfig) {
				guildConfig = new GuildConfig({
					guildId: interaction.guild.id,
					whitelistedRoles: [],
					blacklistedPhrases: [],
				});
				await guildConfig.save();
			}

			let replyMessage;

			switch (subcommand) {
				case "add":
					if (!guildConfig.whitelistedRoles.includes(targetRole.id)) {
						// Push the new role ID to the whitelistedRoles array
						guildConfig.whitelistedRoles.push(targetRole.id);
						await guildConfig.save();
						await interaction.reply({
							content: `${targetRole.name} has been whitelisted.\n`,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `${targetRole.name} is already whitelisted.\n`,
							ephemeral: true,
						});
					}
					break;
				case "remove":
					const index = guildConfig.whitelistedRoles.indexOf(targetRole.id);
					if (index !== -1) {
						// Remove the role ID from the whitelistedRoles array
						guildConfig.whitelistedRoles.splice(index, 1);
						await guildConfig.save();
						await interaction.reply({
							content: `${targetRole.name} has been removed from the whitelist.\n`,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `${targetRole.name} is not whitelisted.\n`,
							ephemeral: true,
						});
					}
					break;
				case "list":
					if (guildConfig.whitelistedRoles.length === 0) {
						replyMessage = `There are no whitelisted roles.\n`;
					} else {
						replyMessage = `Whitelisted Roles:\n`;
						guildConfig.whitelistedRoles.forEach((roleId, index) => {
							const role = interaction.guild.roles.cache.get(roleId);
							if (role) {
								replyMessage += `${index + 1}. ${role.name}\n`;
							} else {
								// If the role is not found (perhaps it was deleted), display its ID instead
								replyMessage += `${index + 1}. Role ID: ${roleId} (Role not found)\n`;
							}
						});
					}
					await interaction.reply({
						content: replyMessage,
						ephemeral: true,
					});
					break;
				default:
					await interaction.reply({
						content: `Invalid subcommand.`,
						ephemeral: true,
					});
			}
		} catch (error) {
			console.error("Error:", error);
			await interaction.reply({
				content: `An error occurred.`,
				ephemeral: true,
			});
		}
	},
};

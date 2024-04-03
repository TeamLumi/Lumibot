const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { GuildConfig } = require("../../../models/keys.js");

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
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const targetRole = interaction.options.getRole("target");

		try {
			// Find the guild configuration data
			const guildConfig = await GuildConfig.findOne({
				guildId: interaction.guild.id,
			});

			if (!guildConfig) {
				await interaction.reply("Guild configuration not found.");
				return;
			}

			switch (subcommand) {
				case "add":
					if (!guildConfig.whitelistedRoles.includes(targetRole.id)) {
						// Push the new role ID to the whitelistedRoles array
						guildConfig.whitelistedRoles.push(targetRole.id);
						await guildConfig.save();
						await interaction.reply(`${targetRole.name} has been whitelisted.`);
					} else {
						await interaction.reply(`${targetRole.name} is already whitelisted.`);
					}
					break;
				case "remove":
					const index = guildConfig.whitelistedRoles.indexOf(targetRole.id);
					if (index !== -1) {
						// Remove the role ID from the whitelistedRoles array
						guildConfig.whitelistedRoles.splice(index, 1);
						await guildConfig.save();
						await interaction.reply(
							`${targetRole.name} has been removed from the whitelist.`,
						);
					} else {
						await interaction.reply(`${targetRole.name} is not whitelisted.`);
					}
					break;
				default:
					await interaction.reply("Invalid subcommand.");
			}
		} catch (error) {
			console.error("Error:", error);
			await interaction.reply("An error occurred.");
		}
	},
};

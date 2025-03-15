const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { GuildConfig } = require("../../../keys.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("emulator")
		.setDescription(
			"Moderator Command: Base command for blacklisting emulators",
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Blacklist subcommand to mark an emulator name")
				.addStringOption(option =>
					option
						.setName("string")
						.setDescription("Type the name here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Blacklist subcommand to remove an emulator name")
				.addStringOption(option =>
					option
						.setName("string")
						.setDescription("Type the name here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Blacklist subcommand to list all emulators"),
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const targetPhrase = interaction.options.getString("string");

		try {
			let guildConfig = await GuildConfig.findOne({
				guildId: interaction.guild.id,
			});

			if (!guildConfig) {
				guildConfig = new GuildConfig({
					guildId: interaction.guild.id,
					whitelistedRoles: [],
					blacklistedPhrases: [],
                    unsupportedEmulators: [],
				});
				await guildConfig.save();
			}

			let replyMessage;

			switch (subcommand) {
				case "add":
					if (!guildConfig.unsupportedEmulators.includes(targetPhrase)) {
						// Add the new phrase to the emulator list
						guildConfig.unsupportedEmulators.push(targetPhrase);
						await guildConfig.save();
						replyMessage = `Added "${targetPhrase}" to the emulator list.\n`;
					} else {
						replyMessage = `${targetPhrase} is already in the list.\n`;
					}
					await interaction.reply({
						content: replyMessage,
						ephemeral: true,
					});
					break;
				case "remove":
					const index = guildConfig.unsupportedEmulators.indexOf(targetPhrase);
					if (index !== -1) {
						// Remove the phrase from the emulator list
						guildConfig.unsupportedEmulators.splice(index, 1);
						await guildConfig.save();
						await interaction.reply({
							content: `Removed "${targetPhrase}" from the emulator list.\n`,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `${targetPhrase} is not in the emulator list.\n`,
							ephemeral: true,
						});
					}
					break;
				case "list":
					if (guildConfig.unsupportedEmulators.length === 0) {
						replyMessage = `There are no emulators listed.\n`;
					} else {
						replyMessage = `Emulators:\n`;
						guildConfig.unsupportedEmulators.forEach((phrase, index) => {
							replyMessage += `${index + 1}. ${phrase}\n`;
						});
					}
					await interaction.reply({
						content: replyMessage,
					});
					break;
				default:
					await interaction.reply({
						content: `Invalid subcommand.`,
						ephemeral: true,
					});
			}
		} catch (error) {
			console.error(`Error:`, error);
			await interaction.reply({
				content: `An error occurred.`,
				ephemeral: true,
			});
		}
	},
};

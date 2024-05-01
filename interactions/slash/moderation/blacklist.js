const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { GuildConfig } = require("../../../keys.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("blacklist")
		.setDescription(
			"Moderator Command: Base command for blacklisting phrases/URLs",
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Blacklist subcommand to mark a phrase as spam")
				.addStringOption(option =>
					option
						.setName("string")
						.setDescription("Type the phrase here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Blacklist subcommand to remove a phrase from spam")
				.addStringOption(option =>
					option
						.setName("string")
						.setDescription("Type the phrase here")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Blacklist subcommand to list all blacklisted phrases"),
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
				});
				await guildConfig.save();
			}

			let replyMessage;

			switch (subcommand) {
				case "add":
					if (!guildConfig.blacklistedPhrases.includes(targetPhrase)) {
						// Add the new phrase to the blacklist
						guildConfig.blacklistedPhrases.push(targetPhrase);
						await guildConfig.save();
						replyMessage = `Added "${targetPhrase}" to the blacklist.`;
					} else {
						replyMessage = `${targetPhrase} is already blacklisted.`;
					}
					await interaction.reply(replyMessage);
					break;
				case "remove":
					const index = guildConfig.blacklistedPhrases.indexOf(targetPhrase);
					if (index !== -1) {
						// Remove the phrase from the blacklist
						guildConfig.blacklistedPhrases.splice(index, 1);
						await guildConfig.save();
						replyMessage = `Removed "${targetPhrase}" from the blacklist.`;
					} else {
						replyMessage = `${targetPhrase} is not blacklisted.`;
					}
					await interaction.reply(replyMessage);
					break;
				case "list":
					if (guildConfig.blacklistedPhrases.length === 0) {
						replyMessage = "There are no blacklisted phrases.";
					} else {
						replyMessage = "Blacklisted Phrases:\n";
						guildConfig.blacklistedPhrases.forEach((phrase, index) => {
							replyMessage += `${index + 1}. ${phrase}\n`;
						});
					}
					await interaction.reply(replyMessage);
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

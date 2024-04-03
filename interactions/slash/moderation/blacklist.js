const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { GuildConfig } = require("../../../models/keys.js");

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
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const targetPhrase = interaction.options.getString("string");

		try {
			const guildConfig = await GuildConfig.findOne({
				guildId: interaction.guild.id,
			});

			if (!guildConfig) {
				await interaction.reply("Guild configuration not found.");
				return;
			}

			let replyMessage;
			let updatedBlacklist;

			switch (subcommand) {
				case "add":
					// Logic to add phrases to the blacklist
					updatedBlacklist = [...guildConfig.blacklistedPhrases, targetPhrase];
					replyMessage = `Added "${targetPhrase}" to the blacklist.`;
					break;
				case "remove":
					// Logic to remove phrases from the blacklist
					updatedBlacklist = guildConfig.blacklistedPhrases.filter(
						phrase => phrase !== targetPhrase,
					);
					replyMessage = `Removed "${targetPhrase}" from the blacklist.`;
					break;
				default:
					await interaction.reply("Invalid subcommand.");
					return;
			}

			await GuildConfig.findOneAndUpdate(
				{ guildId: interaction.guild.id },
				{ $set: { blacklistedPhrases: updatedBlacklist } },
				{ new: true }, // To return the updated document
			);

			await interaction.reply(replyMessage);
		} catch (error) {
			console.error("Error:", error);
			await interaction.reply("An error occurred.");
		}
	},
};

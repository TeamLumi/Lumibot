const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("amicute")
		.setDescription("Tests whether or not you are cute."),

	async execute(interaction) {
		const embed = new EmbedBuilder().setTitle(`Shaymin:`);

		if (interaction.member.roles.cache.has("999400184582774824")) {
			embed.setDescription("You're very cute DJ! :)");
		} else {
			embed.setDescription("You are not as cute as DJ. Sorry :(");
		}
		await interaction.reply({ embeds: [embed] });
	},
};

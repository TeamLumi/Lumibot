const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("amicute")
		.setDescription("Tests whether or not you are cute."),

	async execute(interaction) {
		const embed = new EmbedBuilder().setTitle(`Shaymin:`);

		if (interaction.member.id === "194583783368818688") {
			embed.setDescription("You're very cute DJ! :)");
		} else {
			embed.setDescription("You are not as cute as DJ. Sorry :(");
		}
		await interaction.reply({ embeds: [embed] });
	},
};

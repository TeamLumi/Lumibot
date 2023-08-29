const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[dj]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setTitle("DJ - Noun.")
			.setDescription(`The best person on the Lumi team.`)
			.setImage(
				"https://archives.bulbagarden.net/media/upload/4/4c/0133Eevee.png",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

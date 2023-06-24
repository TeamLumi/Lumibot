const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[dj]"],
	},
	execute(message, args) {
		const attachment = new AttachmentBuilder("./assets/eevee.png");

		const embed = new EmbedBuilder()
			.setTitle("DJ")
			.setDescription(`The best person on the Lumi team.`)
			.setImage("attachment://eevee.png")
			.setColor(0x000000);

		message.channel.send({ embeds: [embed], files: [attachment] });
	},
};

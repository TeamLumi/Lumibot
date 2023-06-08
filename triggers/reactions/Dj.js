const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: {
	name: ["[DJ]", "[dj]", "[Dj]"],
	},
	execute(message, args) {
		const attachment = new AttachmentBuilder('./assets/eevee.png');

		const embed = new EmbedBuilder()
		.setColor(0x000000)
		.setTitle('Shaymin:')
		.addFields({ name: 'DJ - Noun', value: 'The best person on the Lumi team.' })
		.setImage('attachment://eevee.png')
	
		message.channel.send({ embeds: [embed], files: [attachment] });
	},
};
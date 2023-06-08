const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: {
		name: ["[faq]"],
		},
	execute(message, args) {
		const attachment = new AttachmentBuilder('./assets/eevee.png');

		const embed = new EmbedBuilder()
		.setColor(0x90EE90)
		.setTitle('Shaymin:')
		.setThumbnail('attachment://eevee.png')
		.addFields(
			{ 
				name: `Frequently Asked Questions`, 
				value: `Find answers to all your frequently asked questions on our [:scroll: FAQ page](https://luminescent.team/docs/faq).`
			}
		)
	
		message.channel.send({ embeds: [embed], files: [attachment] });
	},
};
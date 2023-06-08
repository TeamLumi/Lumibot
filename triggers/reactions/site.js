const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: {
		name: ["[site]", "[website]"],
		},
	execute(message, args) {

		const embed = new EmbedBuilder()
		.setColor(0xADD8E6)
		.setTitle('Shaymin:')
		.setThumbnail('https://archives.bulbagarden.net/media/upload/0/0c/133Eevee_RB.png')
		.addFields(
			{ 
				name: `Luminescent Website`, 
				value: `Check out [our website :computer:](https://luminescent.team/) for all the help you need!`
			}
		)
	
		message.channel.send({ embeds: [embed] });
	},
};
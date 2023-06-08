const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: {
		name: ["[download]"],
		},
	execute(message, args) {

		const embed = new EmbedBuilder()
		.setColor(0xADD8E6)
		.setTitle('Shaymin:')
		.setThumbnail('https://archives.bulbagarden.net/media/upload/e/e2/0133Eevee-Gigantamax.png')
		.addFields(
			{ 
				name: `Download Luminescent Platinum`, 
				value: `Check out [our Nexus Mods page](https://www.nexusmods.com/pokemonbdsp/mods/1) to download our mod!\n\n**You must provide your own dumb of Brilliant Diamond 1.3.0** from a hacked Switch to work with Luminescent Platinum; asking anybody to provide download links is piracy and an instant ban.`
			}
		)
	
		message.channel.send({ embeds: [embed] });
	},
};
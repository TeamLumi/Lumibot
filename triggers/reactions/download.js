const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[download]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/e/e2/0133Eevee-Gigantamax.png",
			)
			.setTitle("Download Luminescent Platinum")
			.setURL("https://www.nexusmods.com/pokemonbdsp/mods/1")
			.setDescription(
				`Check out our [Nexus Mods page](https://www.nexusmods.com/pokemonbdsp/mods/1) to download our mod!\n\n**You must provide your own dump of Brilliant Diamond 1.3.0** from a hacked Switch to work with Luminescent Platinum; asking anybody to provide download links is piracy and an instant ban.`,
			)
			.setColor(0xadd8e6);

		message.channel.send({ embeds: [embed] });
	},
};

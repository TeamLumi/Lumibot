const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[tracker]", "[nuzlocke]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/3/34/133Eevee_Dream_7.png",
			)
			.setTitle("Nuzlocke Tracker")
			.setURL("https://lumiplat.netlify.app/")
			.setDescription(
				"Use this website to create a tracker for your own Nuzlocke run of Luminescent Platinum.\n\nContains built-in information for all route encounters, static gifts, boss fights, damage calculations, and so many other wonderful features. Check it out yourself!\n\nBest viewed in an incognito tab, and you should use the side menu to export your progress regularly.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

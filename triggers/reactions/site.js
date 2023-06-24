const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[site]", "[website]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/0/0c/133Eevee_RB.png",
			)
			.setTitle("Luminescent Website")
			.setURL("https://luminescent.team/")
			.setDescription(
				"Check out our website :computer: for all the help you need!",
			)
			.setColor(0x00b0f4);

		message.channel.send({ embeds: [embed] });
	},
};

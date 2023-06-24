const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[faq]"],
	},
	execute(message, args) {
		const attachment = new AttachmentBuilder("./assets/eevee.png");

		const embed = new EmbedBuilder()
			.setThumbnail("attachment://eevee.png")
			.setTitle("Frequently Asked Questions")
			.setURL("https://luminescent.team/faq")
			.setDescription(
				`Find answers to all your frequently asked questions on our [:scroll: FAQ page]().`,
			)
			.setColor(0x90ee90);

		message.channel.send({ embeds: [embed], files: [attachment] });
	},
};

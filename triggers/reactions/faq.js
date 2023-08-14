const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[faq]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682731343499314/faq.png",
			)
			.setTitle("Frequently Asked Questions")
			.setURL("https://luminescent.team/docs/faq")
			.setDescription(
				`Find answers to all your frequently asked questions on our [:scroll: FAQ page](https://luminescent.team/docs/faq).`,
			)
			.setColor(0x90ee90);

		message.channel.send({ embeds: [embed] });
	},
};

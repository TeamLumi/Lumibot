const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[mods]", "[included]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115681768742322286/prepackaged_mods.png",
			)
			.setTitle("Pre-Packaged Mods")
			.setURL("https://luminescent.team/docs/mods")
			.setDescription(
				"A list of all of our pre-packaged mods, including Yisuno's Sky Battlen't, and a list of compatible mods. Please don't install any unlisted mods alongside Luminescent Platinum, or you will very likely break it.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};
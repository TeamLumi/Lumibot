const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[features]", "[included]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682729762242570/features.png",
			)
			.setTitle("Mod Features")
			.setURL("https://luminescent.team/docs/features")
			.setDescription(
				"See all the cool features, updates, and included mods in Luminescent Platinum!",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

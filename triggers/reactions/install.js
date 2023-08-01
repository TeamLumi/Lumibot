const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[install]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682728726249512/tutorial_eevee.png",
			)
			.setTitle("Installation")
			.setURL("https://luminescent.team/docs/category/installation")
			.setDescription(
				"Which platform are you installing on? Check out your options here!\n\nIf you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

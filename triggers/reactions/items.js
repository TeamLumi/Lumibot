const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[items]", "[tms]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115681769887387748/items.png",
			)
			.setTitle("Items & TMs")
			.setURL("https://luminescent.team/docs/features")
			.setDescription(
				"List of our items & TM locations. Currently copied from Renegade Platinum's list, and being updated to match Luminescent Platinum's.\n\nPlease report any issues or corrections to https://discord.com/channels/912508046159261728/1073098396774182972",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

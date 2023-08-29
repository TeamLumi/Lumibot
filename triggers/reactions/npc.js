const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[npc]", "[npcs]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
		  	})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682729762242570/features.png",
			)
			.setTitle("Useful NPCs")
			.setURL("https://luminescent.team/docs/npc")
			.setDescription(
				"All of our useful NPCs in Luminescent Platinum, including IV Hyper Trainer, EV Trainer, and Jan!",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

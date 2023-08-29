const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[evolve]", "[evolution]", "[evolutions]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682730974396437/randomize_.png",
			)
			.setTitle("Evolutions")
			.setURL("https://luminescent.team/docs/evolutions")
			.setDescription(
				"List of all altered evolutions in Luminescent Platinum as compared to vanilla BDSP.\n\nContains changes originally seen in Renegade Platinum, regional evolutions, and any of our own tweaks. Plaintext version available at the bottom.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

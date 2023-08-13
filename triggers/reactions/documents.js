const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[docs]", "[documents]", "[document]", "[documentation]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115681770373906492/documentation.png",
			)
			.setTitle("Documentation")
			.setURL("https://luminescent.team/docs")
			.setDescription(
				"Here is our page listing non-site documentation, such as the Pokédex, boss information, and our Professor Oak Challenge document.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

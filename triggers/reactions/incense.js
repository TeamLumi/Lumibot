const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[incense]", "[regionals]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682730626273317/regionals.png",
			)
			.setTitle("Incense Burner & Regionals")
			.setURL("https://luminescent.team/docs/incense-regional")
			.setDescription(
				"What's an incense burner? How do I find the regional Pokémon? What generations are included? All those answers and more are [found here](https://luminescent.team/docs/incense-regional)!",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

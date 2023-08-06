const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: [
			"[encounters]",
			"[gifts]",
			"[static]",
			"[legendary]",
			"[legendaries]",
			"[trade]",
			"[trades]",
		],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682731884560485/gremlin.png",
			)
			.setTitle("Special Encounters")
			.setDescription(
				"All Pokémon special encounters in the game. Includes gifts, static encounters, trades, and legendaries.",
			)
			.setColor(0x000000);

		if (message.content.toLowerCase().includes("[encounters]")) {
			embed.setURL("https://luminescent.team/docs/category/special-events");
		} else if (message.content.toLowerCase().includes("[gifts]")) {
			embed.setURL("https://luminescent.team/docs/special-events/gifts");
		} else if (message.content.toLowerCase().includes("[static]")) {
			embed.setURL("https://luminescent.team/docs/special-events/static");
		} else if (message.content.toLowerCase().includes("[trades]")) {
			embed.setURL("https://luminescent.team/docs/special-events/trade");
		} else if (message.content.toLowerCase().includes("[trade]")) {
			embed.setURL("https://luminescent.team/docs/special-events/trade");
		} else {
			embed.setURL("https://luminescent.team/docs/special-events/legendaries");
		}

		message.channel.send({ embeds: [embed] });
	},
};

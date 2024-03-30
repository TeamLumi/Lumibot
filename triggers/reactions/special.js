const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: [
			"[encounters]",
			"[gifts]",
			"[gift]",
			"[static]",
			"[legendary]",
			"[legendaries]",
			"[trade]",
			"[trades]",
		],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682731884560485/gremlin.png",
			)
			.setTitle("Special Encounters")
			.setDescription(
				"All Pokémon special encounters in the game. Includes gifts, static encounters, trades, and legendaries.",
			)
			.setColor(0x000000);

		if (message.content.toLowerCase().includes("[encounters]"))
			embed.setURL("https://luminescent.team/docs/category/special-events");
		else if (message.content.toLowerCase().includes("[gifts]"))
			embed
				.setTitle("Gifted Pokémon")
				.setURL("https://luminescent.team/docs/special-events/gifts")
				.setDescription("See what gifts you can receive in Luminescent Platinum.");
		else if (message.content.toLowerCase().includes("[gift]"))
			embed
				.setTitle("Gifted Pokémon")
				.setURL("https://luminescent.team/docs/special-events/gifts")
				.setDescription("See what gifts you can receive in Luminescent Platinum.");
		else if (message.content.toLowerCase().includes("[static]"))
			embed
				.setTitle("Static Encounters")
				.setURL("https://luminescent.team/docs/special-events/static")
				.setDescription(
					"See what static Pokémon you can encounter on the overworld in Luminescent Platinum.",
				);
		else if (message.content.toLowerCase().includes("[trades]"))
			embed
				.setTitle("Traded Pokémon")
				.setURL("https://luminescent.team/docs/special-events/trade")
				.setDescription("All available trades in the game.");
		else if (message.content.toLowerCase().includes("[trade]"))
			embed
				.setTitle("Traded Pokémon")
				.setURL("https://luminescent.team/docs/special-events/trade")
				.setDescription("All available trades in the game.");
		else
			embed
				.setTitle("Legendary Encounters")
				.setURL("https://luminescent.team/docs/special-events/legendaries")
				.setDescription(
					"See how to find and capture all legendary Pokémon in Luminescent Platinum.",
				);

		message.channel.send({ embeds: [embed] });
	},
};

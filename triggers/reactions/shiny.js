const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[shiny]", "[shiny odds]", "[masuda]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setTitle("Shiny Odds")
			.setURL("https://luminescent.team/docs/features")
			.setDescription(
				"Luminescent Platinum's shiny rate is 8/4096 (1/512). This means that the shiny charm (+1) brings it to 9/4096, and the Masuda Method (+2) brings it to 10/4096. All together, you can bring the shiny rate to 11/4096.\n\nThis compounds with [radar chaining](https://cdn.discordapp.com/attachments/917239249747738624/1167491975231066183/image.png?ex=654e52a1&is=653bdda1&hm=8043bff359b11850c02bf8bd5ada206ef9bafe326f33ceac948ad7d0738d5a87&), adding one roll for each tier you achieve. (Credit to *chee* for the math/image.)\n\n***Nothing*** is shiny locked in Luminescent Platinum! For gifts, you must get to their Pokédex entry page to check their shininess.\n\nWe additionally offer a [trade](https://luminescent.team/docs/special-events/trade) for a Masuda Method 6IV Ditto in the game.",
			)
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682729762242570/features.png",
			)
			.setColor("#00b0f4");
		message.channel.send({ embeds: [embed] });
	},
};

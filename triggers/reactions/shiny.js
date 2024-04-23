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
				"Luminescent Platinum's shiny rate is 8/4096 (1/512). This means that the shiny charm (+2) brings it to 10/4096, and the Masuda Method (+6) brings it to 14/4096. All together, you can bring the shiny rate to 16/4096.\n\nThis compounds with [radar chaining](https://i.imgur.com/lJvcQBo.jpeg), adding one roll for each tier you achieve. (Credit to *chee* for the math/image.)\n\n***Nothing*** is shiny locked in Luminescent Platinum! For gifts, you must get to their Pokédex entry page to check their shininess.\n\nWe additionally offer a [trade](https://luminescent.team/docs/special-events/trade) for a Masuda Method 6IV Ditto in the game.",
			)
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682729762242570/features.png?ex=65f08683&is=65de1183&hm=4c7243015d2f2217dbbcc481f9a60ff940909b2a5ab71aead774c72a7f709d77&",
			)
			.setColor("#00b0f4");
		message.channel.send({ embeds: [embed] });
	},
};

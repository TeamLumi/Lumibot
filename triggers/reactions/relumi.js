const { EmbedBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[relumi]", "[reilluminated]", "[3.0]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail("https://archives.bulbagarden.net/media/upload/8/84/0133Eevee-Partner.png")
			.setTitle("Re:Illuminated Platinum")
			.setDescription(
				`What was previously called "Natdex" or "3.0" is now *Re:Illuminated Platinum*. At launch, it will include all Pokémon up to Legends Arceus (full Gen 8) with Gen 9 coming later. It will also feature extra story content, redone fights with new Pokémon, expanded legendary quests (3.1+), and many quality-of-life improvements that weren't feasible with the backend used in 2.0F/Luminescent Platinum.\n\n` +
				`Saves will not be compatible between 2.0 and 3.0 due to changes in the backend engine.\n\n` +
				`As this is a volunteer project with significant work remaining, we do not have an ETA for its release and appreciate your patience.`
			)
			.setColor(0x00b0f4);

		message.channel.send({ embeds: [embed] });
	},
};

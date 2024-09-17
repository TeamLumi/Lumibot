const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

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
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/8/84/0133Eevee-Partner.png",
			)
			.setTitle("Re:Illuminated Platinum")
			.setDescription(
				"What was was previously just called "Natdex" or "3.0" is now *Re:Illuminated Platinum*. At launch, it will include all Pokémon up to Legends Arceus (full gen 8) with gen 9 coming later on. It will also include extra story, all fights redone to include the new 'mons, expanded legendary quests (3.1+) and many other quality of life features that we are unable to do with the backend used in 2.0F/Luminescent Platinum.\n\nSaves will not be compatible between 2.0 and 3.0 because of how we will be changing the backend engine adjustments.\n\nSince this is a volunteer project with massive amounts of work still to go, we have no ETA when it will be available, and ask for your patience.",
			)
			.setColor(0x00b0f4);

		message.channel.send({ embeds: [embed] });
	},
};

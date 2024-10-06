const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[affection]", "[friendship]",],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682731343499314/faq.png",
			)
			.setTitle("What Is Affection?")
			.setURL("https://luminescent.team/docs/faq")
			.setDescription(
				`Among the options available to toggle on or off in Luminescent Platinum, we allow players to turn "affection" off at a Pokémon Center's computer.\n\n[Affection](https://bulbapedia.bulbagarden.net/wiki/Affection) is the "[Pokémon] held on so you wouldn't be sad!" mechanic. It scales on the same number as friendship/happiness, but will not affect other mechanics related to friendship. This includes Sylveon's evolution, despite previous generations specifically being tied to the affection mechanic. It's friendship now.`,
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

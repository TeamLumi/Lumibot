const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[stp]", "[shattered]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1116745890577776862/1476701476255567964/STP.png",
			)
			.setTitle("Pokemon Shattered Platinum")
			.setURL("https://discord.gg/6EgVgkqfUf")
			.setDescription(
				`# **Pokémon Shattered Platinum**\n\nShattered Platinum is a mod for Pokémon Brilliant Diamond and Shining Pearl, based on Re:Illuminated Platinum. Its goal is to provide a more "Vanilla" experience with modern quality of life changes and some extras.\n\n-# NOTE: This mod will release AFTER Re:Illuminated Platinum!\n\n[Server Invite](https://discord.gg/6EgVgkqfUf)`,
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[changes]", "[changelog]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
		  	})
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682730164879483/changelog.png",
			)
			.setTitle("Luminescent Changelog")
			.setURL("https://luminescent.team/docs/changelog")
			.setDescription("See what's changed in our newest updates!")
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[atmosphere]", "[switch]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682728726249512/tutorial_eevee.png",
			)
			.setTitle("Switch Atmosphere Installation")
			.setURL("https://luminescent.team/docs/installation/atmosphere")
			.setDescription(
				"See how to install the mod on official Switch hardware using the Atmosphere loader. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nThis requires having a hacked Switch. Questions about how to hack your Switch or use Atmosphere should be taken to more appropriate servers or Googled.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

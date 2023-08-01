const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[ryujinx]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682728726249512/tutorial_eevee.png",
			)
			.setTitle("Ryujinx Installation")
			.setURL("https://luminescent.team/docs/installation/ryujinx")
			.setDescription(
				"See how to install the mod on Ryujinx emulator. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nQuestions on how to use or install the emulator itself should be taken to more appropriate servers or Googled.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

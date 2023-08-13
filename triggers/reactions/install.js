const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[install]", "[atmosphere]", "[switch]", "[yuzu]", "[ryujinx]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682728726249512/tutorial_eevee.png",
			)
			.setColor(0x000000);

		if (message.content.toLowerCase().includes("[atmosphere]")) {
			embed
				.setTitle("Switch Atmosphere Installation")
				.setURL("https://luminescent.team/docs/installation/atmosphere")
				.setDescription(
					"See how to install the mod on official Switch hardware using the Atmosphere loader. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nThis requires having a hacked Switch. Questions about how to hack your Switch or use Atmosphere should be taken to more appropriate servers or Googled.",
				);
		} else if (message.content.toLowerCase().includes("[switch]")) {
			embed
				.setTitle("Switch Atmosphere Installation")
				.setURL("https://luminescent.team/docs/installation/atmosphere")
				.setDescription(
					"See how to install the mod on official Switch hardware using the Atmosphere loader. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nThis requires having a hacked Switch. Questions about how to hack your Switch or use Atmosphere should be taken to more appropriate servers or Googled.",
				);
		} else if (message.content.toLowerCase().includes("[yuzu]")) {
			embed
				.setTitle("Yuzu Installation")
				.setURL("https://luminescent.team/docs/installation/yuzu")
				.setDescription(
					"See how to install the mod on Yuzu emulator. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nWe strongly recommend against using Yuzu due to a multitude of bugs, and future incompatibility with our mods because of inaccurate emulation.\n\nQuestions on how to use or install the emulator itself should be taken to more appropriate servers or Googled.",
				);
		} else if (message.content.toLowerCase().includes("[ryujinx]")) {
			embed
				.setTitle("Ryujinx Installation")
				.setURL("https://luminescent.team/docs/installation/ryujinx")
				.setDescription(
					"See how to install the mod on Ryujinx emulator. If you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624 \n\nQuestions on how to use or install the emulator itself should be taken to more appropriate servers or Googled.",
				);
		} else {
			embed
				.setTitle("Installation")
				.setURL("https://luminescent.team/docs/category/installation")
				.setDescription(
					"Which platform are you installing on? Check out your options here!\n\nIf you still have issues, please make a thread in https://discord.com/channels/912508046159261728/1020986285076250624",
				);
		}

		message.channel.send({ embeds: [embed] });
	},
};

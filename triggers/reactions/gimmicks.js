const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[gimmicks]", "[gimmick]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/6/62/0133Eevee-Gigantamax_2.png",
			)
			.setColor(0x000000);

		if (message.content.toLowerCase().includes("bat"))
			embed
				.setTitle("Battle Gimmicks")
				.setDescription(
					"**We aren't doing any of them.** No Megas, Z-Moves, Dynamaxing or Tera. They would simply be a full nightmare to balance and would only make the game less cohesive.\n\nCostumes for Megas or PKHex-only access have been discussed internally but no consensus has been reached.",
				);
		else if (message.content.toLowerCase().includes("chibi"))
			embed
				.setTitle("De-Chibification")
				.setDescription(
					"**We're not doing that.** You may have seen it in a proof of concept video, but we have determined that the scale of full battle models does not fit in the world map as it stands. We would need to redo all overworld graphics and make overworld models for those who don't have battle versions (townspeople and nurses), which has led us to determine that the workload for such a project is 100% not worth it.",
				);
		else if (message.content.toLowerCase().includes("dw"))
			embed
				.setTitle("Distortion World")
				.setDescription(
					"**Just not happening.** Too much effort for a 15 minute hallway simulator. If it happens, it will be when we have nothing left to do.",
				);
		else if (message.content.toLowerCase().includes("rtx"))
			embed
				.setTitle("RTX Shading")
				.setDescription(
					`Although we showed it off in a video, **we will not be releasing the "RTX mod"** because of two reasons: it looks like shit, the shadows on many things are simply pixelated and blocky; and it involves making "modded" versions of every single model that would then need to be downloaded and that's gigantic. Too much. Not happening.`,
				);
		else
			embed
				.setTitle("Not in Development")
				.setDescription(
					"Luminescent Platinum does not intend to do any sort of special battle gimmicks, changes in graphics mode, or completely complicated by-hand sequences. You may have seen some related things in showcase videos, but are merely proof of concept and we do not intend to add them. This includes, but may not be limited to:\n\n- Megas, Z-Moves, Dynamaxing, Tera [gimmicks] bat\n- De-chibification [gimmicks] chibi\n- Distortion World [gimmicks] dw\n- RTX Shading [gimmicks] rtx",
				);

		message.channel.send({ embeds: [embed] });
	},
};

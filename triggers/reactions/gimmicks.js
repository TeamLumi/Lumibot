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
					"**We aren't doing any of them.** No Megas, Z-Moves, Dynamaxing or Tera. They would simply be a full nightmare to balance and would only make the game less cohesive.\n\nPKHex-only access has been discussed internally, and more details will eventually be released as we figure out what is feasible.",
				);
		else if (message.content.toLowerCase().includes("chibi"))
			embed
				.setTitle("De-Chibification")
				.setDescription(
					"[Dechibified Platinum](https://www.nexusmods.com/pokemonbdsp/mods/38) is a side-mod maintained by a single individual on Team Luminescent. It is not a full-fledged project by the entire team, but we do endorse his work where we can. The Nexus Mods page has install instructions. Please see https://discord.com/channels/912508046159261728/1315469606713819197 for updates or to submit bug reports.",
				);
		else if (message.content.toLowerCase().includes("dw"))
			embed
				.setTitle("Distortion World")
				.setDescription(
					"We have a map and do confirm that it will be in the mod eventually, but we will not hold up any other updates for its inclusion. It'll be here when it's here.",
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
					"Luminescent Platinum does not intend to do any sort of special battle gimmicks, changes in graphics mode, or completely complicated by-hand sequences. You may have seen some related things in showcase videos, but are merely proof of concept and we do not intend to add them. This includes, but may not be limited to:\n\n- Megas, Z-Moves, Dynamaxing, Tera: [gimmicks] bat\n- De-chibification: [gimmicks] chibi (see also: https://discord.com/channels/912508046159261728/1315469606713819197)\n- Distortion World: [gimmicks] dw\n- RTX Shading: [gimmicks] rtx",
				);

		message.channel.send({ embeds: [embed] });
	},
};

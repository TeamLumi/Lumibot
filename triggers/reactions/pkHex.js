const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[pkhex]", "[lumihex]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setThumbnail(
				"https://archives.bulbagarden.net/media/upload/b/bf/133Eevee_Smile.png",
			)
			.setTitle("PkHex Luminescent / LumiHex")
			.setURL("https://github.com/TalonSabre/PKLumiHeX")
			.setDescription(
				"Luminescent Platinum requires a special fork of PkHex due to our save structure. Please always use the most current release to make any general edits you require, and always back up saves before editing them to avoid any potential issues.\n\nPkHex-Lumi is still in beta, so please report https://discord.com/channels/912508046159261728/1019653700169502750 if it has not been acknowledged on the github's readme or releases page. Currently only usable for inserting Pokémon, editing their stats, and adding items. If you try to insert a 'mon that is not supported in Luminescent Platinum, you'll end up with a ditto.\n\n**Note:** we do provide things such as Infinite Rare Candies, an EV trainer, farmable ability items, mints or bottlecaps, and the ability to hyper-train as soon as you have the bottlecaps, directly in the romhack itself if you would like a more natural approach.",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

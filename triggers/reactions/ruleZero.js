const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[rule 0]", "[rule0]"],
	},
	execute(message, args) {
		if (
			!interaction.guild.members.me.permissions.has(
				PermissionsBitField.Flags.KickMembers,
			)
		) {
			return;
		}

		const embed = new EmbedBuilder()
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1115345759496323173/1115682729107935392/ban_hammer_dj.png",
			)
			.setTitle("Rule 0")
			.setURL(
				"https://discord.com/channels/912508046159261728/915762325150105631",
			)
			.setDescription(
				`The https://discord.com/channels/912508046159261728/915762325150105631 are the very first thing you should always read when joining a server.\n\n Pokémon Luminescent Platinum is a romhack that requires Brilliant Diamond 1.3.0 to work. You must legally own and acquire your own copy of the game. If you cannot dump the files from a hacked Nintendo Switch, then they are not considered legal!\n\n :rotating_light:**NO PIRACY IS ALLOWED IN THIS SERVER, EVER, FOR ANY REASON. PIRACY IS ILLEGAL ACQUISITIONS OF NINTENDO OR OTHER COMPANIES' PROPERTY.**\n\n **THIS INCLUDES ALLUDING TO OR IMPLYING YOUR PIRACY OR ASKING FOR: THE ROMS, NSP, XCI, UPDATE FILES, GAMES, FIRMWARE, SHADER CACHES OR KEYS, OR WHERE TO FIND THEM.**:rotating_light:\n\n :rotating_light:**THESE QUESTIONS ARE AN INSTANT BAN.**:rotating_light:`,
			)
			.setColor(0xe6676b);

		message.channel.send({ embeds: [embed] });
	},
};

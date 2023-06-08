const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: {
		name: ["[rule 0]", "[rule0]"],
		},
	execute(message, args) {
		const attachment = new AttachmentBuilder('./assets/ban_hammer.png');

		const embed = new EmbedBuilder()
		.setColor(0x000000)
		.setTitle('Shaymin:')
		.setThumbnail('attachment://ban_hammer.png')
		.addFields(
			{ 
				name: 'Rule 0', 
				value: `The [rules page](https://discord.com/channels/912508046159261728/915762325150105631/997815693397471262) is the very first thing you should always read when joining a server.\n\n Pokémon Luminescent Platinum is a romhack that requires Brilliant Diamond 1.3.0 to work. You must legally own and acquire your own copy of the game. If you cannot dump the files from a hacked Nintendo Switch, then they are not considered legal!\n\n :rotating_light:**NO PIRACY IS ALLOWED IN THIS SERVER, EVER, FOR ANY REASON. PIRACY IS ILLEGAL ACQUISITIONS OF NINTENDO OR OTHER COMPANIES' PROPERTY.**\n\n **THIS INCLUDES ALLUDING TO OR IMPLYING YOUR PIRACY OR ASKING FOR: THE ROMS, NSP, XCI, UPDATE FILES, GAMES, FIRMWARE, SHADER CACHES OR KEYS, OR WHERE TO FIND THEM.**:rotating_light:\n\n :rotating_light:**THESE QUESTIONS ARE AN INSTANT BAN.**:rotating_light:`
			}
		)
	
		message.channel.send({ embeds: [embed], files: [attachment] });
	},
};
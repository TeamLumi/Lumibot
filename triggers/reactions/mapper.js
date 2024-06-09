const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[map]", "[mapper]", "[route]"],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setTitle("Luminescent Mapper")
			.setURL("https://luminescent.team/mapper")
			.setDescription(
				"This interactive mapper allows you to view each route individually and what Pokémon are available there! Ticking individual boxes like *radar* and *incense* will adjust the tables to show you how each modification affects your chances. Currently in beta. For more specifics, or to read up on known bugs or report new ones, please visit https://discord.com/channels/912508046159261728/1249422538514235422 to receive help! \n\n Will eventually contain information such as trainer teams and items found on routes or in shops.",
			)
			.setThumbnail(
				"https://media.discordapp.net/attachments/1115345759496323173/1249428328709095603/DJ-With-Flowers-Looking-Like-The-Cutest-Little-Thing.png?ex=6667444e&is=6665f2ce&hm=a21c33bc1c9525854b52036749d43afc7d78a76e028d369aeeaa616e49f6db8c",
			)
			.setColor("#00b0f4");
		message.channel.send({ embeds: [embed] });
	},
};

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
				"https://img.pokemondb.net/artwork/large/eevee-lets-go.jpg",
			)
			.setColor("#00b0f4");
		message.channel.send({ embeds: [embed] });
	},
};

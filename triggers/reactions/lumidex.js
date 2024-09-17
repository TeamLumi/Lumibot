const { EmbedBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[lumidex]", "[species]"],
	},
	execute(message) {
		const baseDescription = `There are 510 species of Pokémon currently obtainable in Luminescent Platinum. These include the standard 493 Gen 1-4 Pokémon, along with the Litwick line, Sylveon, Obstagoon, Perrserker, Cursola, Sirfetch’d, Mr. Rime, Wyrdeer, Kleavor, Ursaluna, Sneasler, Overqwil, and the Tinkatink line. Also included are their regional pre-evolutions forms, though they aren’t required to complete the national dex. (The Pikipek line technically also exists in the backend if you randomise or pkhex.)\n\nIn our upcoming romhack, Re:Illuminated, we will be expanding the National Pokédex to every Pokémon from Generations 1-8. That will be 905 Pokémon total, with Generation 9 planned to be added at a later date.`;
		const lumihexDescription = `${baseDescription}\n\nIf you were looking for our PkHex fork, try [lumihex] instead.`;

		const embed = new EmbedBuilder()
			.setAuthor({ name: "Team Lumi" })
			.setThumbnail("https://archives.bulbagarden.net/media/upload/8/84/0133Eevee-Partner.png")
			.setTitle("Luminescent Platinum Full 'Dex")
			.setDescription(message.content.toLowerCase().includes("[lumihex]") ? lumihexDescription : baseDescription)
			.setColor(0x00b0f4);

		message.channel.send({ embeds: [embed] });
	},
};

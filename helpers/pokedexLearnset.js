const { EmbedBuilder } = require("discord.js");
const { generateMovesViaLearnset } = require("../dex/index.js");
const { typeColors, typeIcons } = require("./pokedexConstants.js");

function learnsetMode(pokemonInfo, monsID, imageLnk, pokemonPath) {
	// Begin learnset mode.
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setThumbnail(imageLnk);

	const typeColor = typeColors[pokemonInfo.type1];
	if (typeColor) embed.setColor(typeColor);

	let validDesc = "";
	if (pokemonInfo.isValid === 0)
		validDesc = `*This Pokemon is* ***not*** *available in 2.0F.*\n\n`;

	try {
		const learnset = generateMovesViaLearnset(monsID, 100);

		const movesetString = learnset
			.map(entry => {
				const moveTypeIcon = typeIcons[entry.typeName];
				const paddedLevel = entry.level.toString().padEnd(2, "\u00A0");
				return `Level ${paddedLevel} - ${moveTypeIcon} ${entry.moveName}`;
			})
			.join("\n");

		embed.setDescription(
			`${validDesc}**Learnset**:\n${movesetString}\n\nSee more in the [Pokédex](https://luminescent.team/pokedex/${pokemonPath}).`,
		);

		return embed;
	} catch (error) {
		console.error(error);

		// Create a default embed to handle the error situation
		embed.setDescription(
			"That Pokemon seems to learn a move I am unfamiliar with. Perhaps we will get to see such a move one day.",
		);

		return embed;
	}
}

module.exports = { learnsetMode };

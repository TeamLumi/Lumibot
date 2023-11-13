const { EmbedBuilder } = require("discord.js");
const { generateMovesViaLearnset } = require("../dex/index.js");

// Get colours for Types
// prettier-ignore
const typeColors = {
	Grass: "#09B051",
	Fire: "#EE8130",
	Water: "#6390F0",
	Electric: "#F7D02C",
	Ice: "#96D9D6",
	Fighting: "#C22E28",
	Poison: "#A33EA1",
	Ground: "#E2BF65",
	Flying: "#A98FF3",
	Psychic: "#F95587",
	Bug: "#A6B91A",
	Rock: "#B6A136",
	Ghost: "#735797",
	Dragon: "#6F35FC",
	Dark: "#705746",
	Steel: "#B7B7CE",
	Fairy: "#D685AD",
	Normal: "#A8A77A",
};

// Array for pokemon types to set icons.
// prettier-ignore
const typeIcons = {
	Grass: "<:t_grass:1117063031579488370>",
	Fire: "<:t_fire:1117063764487962624>",
	Water: "<:t_water:1117063766308298772>",
	Electric: "<:t_electric:1117063036268711957>",
	Ice: "<:t_ice:1117062636861927505>",
	Fighting: "<:t_fighting:1117063035224334426>",
	Poison: "<:t_poison:1117062634219524146>",
	Ground: "<:t_ground:1117062637566570538>",
	Flying: "<:t_flying:1117063032644845680>",
	Psychic: "<:t_psychic:1117062633191919657>",
	Bug: "<:t_bug:1117062630553702431>",
	Rock: "<:t_rock:1117062629282816061>",
	Ghost: "<:t_ghost:1117062639420452874>",
	Dragon: "<:t_dragon:1117062647439949875>",
	Dark: "<:t_dark:1117063037858353162>",
	Steel: "<:t_steel:1117062632172683414>",
	Fairy: "<:t_fairy:1117062642964635698>",
	Normal: "<:t_normal:1117062635817554010>",
};

function learnsetMode(pokemonInfo, monsID, imageLnk) {
	// Begin learnset mode.
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setThumbnail(imageLnk);

	const typeColor = typeColors[pokemonInfo.type1];
	if (typeColor) {
		embed.setColor(typeColor);
	}

	let validDesc = "";
	if (pokemonInfo.isValid === 0) {
		validDesc = `*This Pokemon is* ***not*** *available in 2.0F.*\n\n`;
	}

	try {
		const learnset = generateMovesViaLearnset(monsID, 100);

		const movesetString = learnset
			.map((entry) => {
				const moveTypeIcon = typeIcons[entry.typeName];
				const paddedLevel = entry.level.toString().padEnd(2, "\u00A0");
				return `Level ${paddedLevel} - ${moveTypeIcon} ${entry.moveName}`;
			})
			.join("\n");

		embed.setDescription(
			`${validDesc}**Learnset**:\n${movesetString}\n\n[See more in Pokédex](https://luminescent.team/pokedex/${monsID})`,
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

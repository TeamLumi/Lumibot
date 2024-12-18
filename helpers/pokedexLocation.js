const { EmbedBuilder } = require("discord.js");
const {
	getRoutesFromPokemonId,
	getEvolutionTree,
	getPokemonDisplayName,
} = require("../dex/index.js");
const {
	typeColors,
	reverseEncounterTypeMap,
} = require("./pokedexConstants.js");

function locationMode(pokemonInfo, monsID, imageLnk, pokemonPath) {
	const pokemonName = pokemonInfo.name;
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonName}**`)
		.setThumbnail(imageLnk);
	const typeColor = typeColors[pokemonInfo.type1];

	if (typeColor) embed.setColor(typeColor);

	const locations = getRoutesFromPokemonId(monsID);
	function buildTextFromRoutes(routes, pokemonName) {
		const combinedRoutes = routes.reduce((acc, route) => {
			const key = route.name;
			acc[key] = acc[key] || [];
			acc[key].push(route);
			return acc;
		}, {});

		let lumiWebsite = "https://luminescent.team/docs/special-events/";

		let text = "";
		let counter = 0;
		for (const [key, routes] of Object.entries(combinedRoutes)) {
			if (counter >= 10) {
				text += `\nLocations have been truncated.`;
				break;
			}
			text += `\n**${key}**\n`;
			routes.forEach(route => {
				const methodEmoji = reverseEncounterTypeMap[route.method] || route.method;
				const roundedChance = Math.ceil(route.chance);
				if (key === "Underground") return (text += `${methodEmoji}\n`);

				if (route.link) text += `[${methodEmoji}](${route.link})`;
				else if (
					route.method === "Gifts" ||
					route.method === "Legendaries" ||
					route.method === "Static"
				)
					text += `[${methodEmoji}](${lumiWebsite}${route.method.toLowerCase()}#${pokemonName.toLowerCase()})`;
				else text += `${methodEmoji}`;

				if (roundedChance === 100) text += ` \n`;
				else text += ` - ${roundedChance}%\n`;

				if (route.minLevel === route.maxLevel)
					text += `*Level:* ${route.minLevel}\n`;
				else text += `*Level:* ${route.minLevel} - ${route.maxLevel}\n`;
			});
			counter++;
		}
		return text;
	}

	function getBackupData(monsID) {
		const evolutionDetails = getEvolutionTree(monsID);
		if (monsID !== evolutionDetails.pokemonId) {
			const locationsBackup = getRoutesFromPokemonId(evolutionDetails.pokemonId);
			const backupName = getPokemonDisplayName(evolutionDetails.pokemonId);
			return {
				locationsBackup,
				backupName,
			};
		}
		return null;
	}

	function generateEmbedDescription(monsID, locations, backupData) {
		let backupText = "";
		if (locations.length === 0) {
			if (backupData) {
				const { locationsBackup, backupName } = backupData;
				if (locationsBackup.length === 0) {
					return `Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`;
				} else {
					backupText = `\n**${backupName}** can be found:\n`;
					locations = locationsBackup;
				}
			} else {
				return `Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`;
			}
		}
		const locationText = buildTextFromRoutes(locations, pokemonName);
		return `**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n${backupText}${locationText}\nSee more in the [Pokédex](https://luminescent.team/pokedex/${pokemonPath}).`;
	}

	const backupData = getBackupData(monsID);
	const embedDescription = generateEmbedDescription(
		monsID,
		locations,
		backupData,
	);
	embed.setDescription(embedDescription);

	return embed;
}

module.exports = { locationMode };

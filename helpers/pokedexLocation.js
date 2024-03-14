const { EmbedBuilder } = require("discord.js");
const {
	getRoutesFromPokemonId,
	getEvolutionTree,
	getPokemonDisplayName,
	getStaticLocations,
} = require("../dex/index.js");

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

// Rename the encounter types
// prettier-ignore
const reverseEncounterTypeMap = {
	"Walking": "<:grass:1136228499477246043> Walking",
	"Radar": "<:pokeradar:1136357617074180116> Radar",
	"Swarm": ":tv: Swarm",
	"Surfing": ":ocean: Surfing",
	"Old Rod": "<:oldrod:1136220484304896001> Old Rod",
	"Good Rod": "<:goodrod:1136220559856906400> Good Rod",
	"Super Rod": "<:superrod:1136220619432792097> Super Rod",
	"Day": "<:Sun:1157324258519818332> Day",
	"Night": "<:Moon:1157324256988889221> Night",
	"Morning": ":sunrise_over_mountains: Morning",
	"Honey Tree": ":honey_pot: Honey Tree",
	"Incense": "<:incense:1136358228356243506> Incense",
	"Daily Trophy Garden": ":trophy: Daily Trophy Garden",
};

// prettier-ignore
const staticNameReplacements = {
	"Starter": "\n**Starter**\nGiven to you by Professor Rowan.",
	"Twinleaf Town": "\n**Twinleaf Town**\nGiven to you by Mom.",
	"Lake Verity": "\n**Lake Verity**\nNone.",
	"Verity Lakefront - Egg": "\n**Jubilife Trainer School**\nOne of the random Pokémon from the Breeder's egg.",
	"Sandgem Town": "\n**Sandgem Town**\nObtained from Professor Rowan's Briefcase.",
	"Jubilife City": "\n**Jubilife City**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Oreburgh City": "\n**Oreburgh City**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Mining Museum": "\n**Oreburgh City**\nRevived from a Fossil in the Mining Museum.",
	"Ravaged Path": "\n**Ravaged Path**\nHidden in the Ravaged Path (requires Surf).",
	"Floaroma Town": "\n**Floaroma Town**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Eterna City Galactic Building": "\n**Eterna City**\nFound in the Eterna Galactic Building after defeating Jupiter.",
	"Old Chateau": "\n**Old Chateau**\nFound haunting an object in the Old Chateu.",
	"Wayward Cave": "\n**Wayward Cave**\nFound in the deepest part of Wayward Cave.",
	"Hearthome City - Egg": "\n**Eterna City**\nOne of the random Pokémon from Cynthia's egg.",
	"Route 209": "\n**Route 209**\nPlace the Odd Keystone into the broken stone tower.",
	"Solaceon Town": "\n**Solaceon Town**\nObtained in a trade with the Breeder for a Starter Pokémon.",
	"Lost Tower": "\n**Lost Tower**\nProceed through Lost Tower and defeat the uncatchable Chandelure.",
	"Celestic Town": "\n**Celestic Town**\nProceed to the shrine with a Pichu in your party to encounter a special Pichu.",
	"Valor Cavern": "\n**Lake Valor**\nFound at Valor Cavern after the Distortion World events.",
	"Acuity Cavern": "\n**Lake Acuity**\nFound at Acuity Cavern after the Distortion World events.",
	"Spear Pillar": "\n**Spear Pillar**\nBring a special Orb to Spear Pillar after the events of the main story.",
	"Pastoria City": "\n**Pastoria City**\nListen to the Old Lady's story in her house.",
	"Grand Underground": "\n**Grand Underground**\nFound wandering in the Grand Underground.",
	"Pokemon Mansion": "\n**Pokemon Mansion**\nHatched from the egg given to you by the Head of the Mansion.",
	"Mt. Coronet - Articuno": "\n**Mt. Coronet**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Valley Windworks - Zapdos": "\n**Valley Windworks**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Victory Road - Moltres": "\n**Victory Road**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Oreburgh Gate - Mewtwo": "\n**Oreburgh Gate**\nUse the Odd Invitation from the Resort Area to access the cave in Oreburgh Gate.",
	"Route 208 - Raikou": "\n**Route 208**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 211 - Entei": "\n**Route 211**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 213 - Suicune": "\n**Route 213**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 220 - Lugia": "\n**Route 220**\nSpeak to Oak in Eterna City with the Legendary Birds, then find Lugia.",
	"Lost Tower - Ho-Oh": "\n**Lost Tower**\nSpeak to Oak in Eterna City with the Legendary Dogs, then find Ho-Oh.",
	"Eterna Forest - Celebi": "\n**Eterna Forest**\nTake the GS Ball from the Celestic Shrine to the Eterna Shrine.",
	"Snowpoint Temple - Regis": "\n**Snowpoint Temple**\nTake a special item to Snowpoint Temple after the main story.",
	"Fullmoon Island - Latis/Cresselia": "\n**Fullmoon Island**\nTake a special item to Fullmoon Island after speaking to the sleeping boy in Canalave.",
	"Route 213 - Kyogre": "\n**Route 213**\nShow Latias and Latios to Steven, then take the Blue Orb to Route 213.",
	"Stark Mountain - Groudon": "\n**Stark Mountain**\nShow Latias and Latios to Steven, then take the Red Orb to Stark Mountain.",
	"Pokemon League - Rayquaza": "\n**Victory Road**\nShow Latias and Latios to Steven, then take the Jade Orb to Victory Road.",
	"Solaceon Ruins - Jirachi": "\n**Solaceon Ruins**\nGrant three wishes across Sinnoh, then head to Solaceon Ruins with a Jigglypuff.",
	"Veilstone City - Deoxys": "\n**Veilstone City**\nInteract with the meteorites in Veilstone after the main story.",
	"Verity Cavern": "\n**Lake Verity**\nFound at Valor Cavern after the Distortion World events.",
	"Stark Mountain - Heatran": "\n**Stark Mountain**\nSpeak with Buck after completing the Stark Mountain events, then return there.",
	"Turnback Cave - Giratina": "\n**Turnback Cave**\nDefeat Giratina in the Distortion World, then find it again in Turnback Cave.",
	"Newmoon Island - Darkrai": "\n**Newmoon Island**\nTake the Member Card from the dark house on Route 217 to Canalave after the Cresselia events.",
	"Flower Paradise - Shaymin": "\n**Flower Paradise**\nGo to Route 224 with Oak's Letter and write your message on the stone tablet.",
	"Hall of Origin - Arceus": "\n**Hall of Origin**\nDefeat all of the Type Master Trainers to earn their Plates, then take the Azure Flute to Spear Pillar.",
	"Amity Square": "\n**Amity Square**\nEnter Amity Square and proceed through the event.",
	"Route 201 - Mew": "\n**Route 201**\n[Find transformed Mew](https://luminescent.team/docs/special-events/legendaries#kanto-legendaries) in three locations across Sinnoh, then encounter at Route 201.",
};

function locationMode(pokemonInfo, monsID, imageLnk) {
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setThumbnail(imageLnk);
	const typeColor = typeColors[pokemonInfo.type1];

	if (typeColor) {
		embed.setColor(typeColor);
	}

	const locations = getRoutesFromPokemonId(monsID);
	function buildTextFromRoutes(routes) {
		const combinedRoutes = routes.reduce((acc, route) => {
			const key = route.name;
			acc[key] = acc[key] || [];
			acc[key].push(route);
			return acc;
		}, {});

		let text = "";
		for (const [key, routes] of Object.entries(combinedRoutes)) {
			text += `\n**${key}**\n`;
			routes.forEach((route) => {
				const methodEmoji =
					reverseEncounterTypeMap[route.method] || route.method;
				text += `${methodEmoji} - ${route.chance}%\n`;
				if (route.minLevel === route.maxLevel) {
					text += `*Level:* ${route.minLevel}\n`;
				} else {
					text += `*Level:* ${route.minLevel} - ${route.maxLevel}\n`;
				}
			});
		}
		return text;
	}

	const staticEncounters = getStaticLocations(pokemonInfo.name);
	function formatStaticEncounters(staticEncounters) {
		return staticEncounters.length > 0
			? `${staticEncounters
					.map((location) => {
						const replacedName = staticNameReplacements[location] || location;
						return `${replacedName}`;
					})
					.join("\n\n")}\n\n`
			: "";
	}

	function getBackupData(monsID) {
		const evolutionDetails = getEvolutionTree(monsID);
		if (monsID !== evolutionDetails.pokemonId) {
			const locationsBackup = getRoutesFromPokemonId(
				evolutionDetails.pokemonId,
			);
			const backupName = getPokemonDisplayName(evolutionDetails.pokemonId);
			const staticEncountersBackup = getStaticLocations(backupName);
			return {
				locationsBackup,
				backupName,
				staticEncountersBackup,
			};
		}
		return null;
	}

	function generateEmbedDescription(
		monsID,
		locations,
		staticEncounters,
		backupData,
	) {
		let backupText = "";
		if (locations.length === 0 && staticEncounters.length === 0) {
			if (backupData) {
				const { locationsBackup, backupName, staticEncountersBackup } =
					backupData;
				if (
					locationsBackup.length === 0 &&
					staticEncountersBackup.length === 0
				) {
					return `Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`;
				} else {
					backupText = `\n**${backupName}** can be found:\n`;
					locations = locationsBackup;
					staticEncounters = staticEncountersBackup;
				}
			} else {
				return `Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`;
			}
		}
		const locationText = buildTextFromRoutes(locations);
		const formattedStaticEncounters = formatStaticEncounters(staticEncounters);
		return `**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n${backupText}${locationText}${formattedStaticEncounters}See more in the [Pokédex](https://luminescent.team/pokedex/${monsID}).`;
	}

	const backupData = getBackupData(monsID);
	const embedDescription = generateEmbedDescription(
		monsID,
		locations,
		staticEncounters,
		backupData,
	);
	embed.setDescription(embedDescription);

	return embed;
}

module.exports = { locationMode };

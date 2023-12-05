const { EmbedBuilder } = require("discord.js");
const {
	getEncounterLocations,
	getEvolutionTree,
	getPokemonDisplayName,
	getStaticLocations,
} = require("../dex/index.js");
const { botChannelProd, botChannelDev } = require("../config.json");

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
	ground_mons: "<:grass:1136228499477246043> Walking",
	swayGrass: "<:pokeradar:1136357617074180116> Radar",
	tairyo: ":tv: Swarm",
	water_mons: ":ocean: Surfing",
	boro_mons: "<:oldrod:1136220484304896001> Old Rod",
	ii_mons: "<:goodrod:1136220559856906400> Good Rod",
	sugoi_mons: "<:superrod:1136220619432792097> Super Rod",
	day: "<:Sun:1157324258519818332> Day",
	night: "<:Moon:1157324256988889221> Night",
	Morning: ":sunrise_over_mountains: Morning",
	"Honey Tree": ":honey_pot: Honey Tree",
	Incense: "<:incense:1136358228356243506> Incense",
	"Daily Trophy Garden": ":trophy: Daily Trophy Garden",
};

// prettier-ignore
const staticNameReplacements = {
	"Starter": "**Starter**\nGiven to you by Professor Rowan.",
	"Twinleaf Town": "**Twinleaf Town**\nGiven to you by Mom.",
	"Lake Verity": "**Lake Verity**\nNone.",
	"Verity Lakefront - Egg": "**Jubilife Trainer School**\nOne of the random Pokémon from the Breeder's egg.",
	"Sandgem Town": "**Sandgem Town**\nObtained from Professor Rowan's Briefcase.",
	"Jubilife City": "**Jubilife City**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Oreburgh City": "**Oreburgh City**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Mining Museum": "**Oreburgh City**\nRevived from a Fossil in the Mining Museum.",
	"Ravaged Path": "**Ravaged Path**\nHidden in the Ravaged Path (requires Surf).",
	"Floaroma Town": "**Floaroma Town**\nReward from the Interviewer in the Pokémon Center for answering her questions.",
	"Eterna City Galactic Building": "**Eterna City**\nFound in the Eterna Galactic Building after defeating Jupiter.",
	"Old Chateau": "**Old Chateau**\nFound haunting an object in the Old Chateu.",
	"Wayward Cave": "**Wayward Cave**\nFound in the deepest part of Wayward Cave.",
	"Hearthome City - Egg": "**Eterna City**\nOne of the random Pokémon from Cynthia's egg.",
	"Route 209": "**Route 209**\nPlace the Odd Keystone into the broken stone tower.",
	"Solaceon Town": "**Solaceon Town**\nObtained in a trade with the Breeder for a Starter Pokémon.",
	"Lost Tower": "**Lost Tower**\nProceed through Lost Tower and defeat the uncatchable Chandelure.",
	"Celestic Town": "**Celestic Town**\nProceed to the shrine with a Pichu in your party to encounter a special Pichu.",
	"Valor Cavern": "**Lake Valor**\nFound at Valor Cavern after the Distortion World events.",
	"Acuity Cavern": "**Lake Acuity**\nFound at Acuity Cavern after the Distortion World events.",
	"Spear Pillar": "**Spear Pillar**\nBring a special Orb to Spear Pillar after the events of the main story.",
	"Pastoria City": "**Pastoria City**\nListen to the Old Lady's story in her house.",
	"Grand Underground": "**Grand Underground**\nFound wandering in the Grand Underground.",
	"Pokemon Mansion": "**Pokemon Mansion**\nHatched from the egg given to you by the Head of the Mansion.",
	"Mt. Coronet - Articuno": "**Mt. Coronet**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Valley Windworks - Zapdos": "**Valley Windworks**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Victory Road - Moltres": "**Victory Road**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Oreburgh Gate - Mewtwo": "**Oreburgh Gate**\nUse the Odd Invitation from the Resort Area to access the cave in Oreburgh Gate.",
	"Route 208 - Raikou": "**Route 208**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 211 - Entei": "**Route 211**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 213 - Suicune": "**Route 213**\nEncountered after the Distortion World events and speaking to Rowan.",
	"Route 220 - Lugia": "**Route 220**\nSpeak to Oak in Eterna City with the Legendary Birds, then find Lugia.",
	"Lost Tower - Ho-Oh": "**Lost Tower**\nSpeak to Oak in Eterna City with the Legendary Dogs, then find Ho-Oh.",
	"Eterna Forest - Celebi": "**Eterna Forest**\nTake the GS Ball from the Celestic Shrine to the Eterna Shrine.",
	"Snowpoint Temple - Regis": "Snowpoint Temple**\nTake a special item to Snowpoint Temple after the main story.",
	"Fullmoon Island - Latis/Cresselia": "**Fullmoon Island**\nTake a special item to Fullmoon Island after speaking to the sleeping boy in Canalave.",
	"Route 213 - Kyogre": "**Route 213**\nShow Latias and Latios to Steven, then take the Blue Orb to Route 213.",
	"Stark Mountain - Groudon": "**Stark Mountain**\nShow Latias and Latios to Steven, then take the Red Orb to Stark Mountain.",
	"Pokemon League - Rayquaza": "**Victory Road**\nShow Latias and Latios to Steven, then take the Jade Orb to Victory Road.",
	"Solaceon Ruins - Jirachi": "**Solaceon Ruins**\nGrant three wishes across Sinnoh, then head to Solaceon Ruins with a Jigglypuff.",
	"Veilstone City - Deoxys": "**Veilstone City**\nInteract with the meteorites in Veilstone after the main story.",
	"Verity Cavern": "**Lake Verity**\nFound at Valor Cavern after the Distortion World events.",
	"Stark Mountain - Heatran": "**Stark Mountain**\nSpeak with Buck after completing the Stark Mountain events, then return there.",
	"Turnback Cave - Giratina": "**Turnback Cave**\nDefeat Giratina in the Distortion World, then find it again in Turnback Cave.",
	"Newmoon Island - Darkrai": "**Newmoon Island**\nTake the Member Card from the dark house on Route 217 to Canalave after the Cresselia events.",
	"Flower Paradise - Shaymin": "**Flower Paradise**\nGo to Route 224 with Oak's Letter and write your message on the stone tablet.",
	"Hall of Origin - Arceus": "**Hall of Origin**\nDefeat all of the Type Master Trainers to earn their Plates, then take the Azure Flute to Spear Pillar.",
	"Amity Square": "**Amity Square**\nEnter Amity Square and proceed through the event.",
};

function locationMode(pokemonInfo, monsID, imageLnk, interaction) {
	const locations = getEncounterLocations(monsID);
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setThumbnail(imageLnk);
	const typeColor = typeColors[pokemonInfo.type1];

	if (typeColor) {
		embed.setColor(typeColor);
	}

	const solaceonRuinsRegex = /^Solaceon Ruins\b.*/;
	const turnbackCaveRegex = /^Turnback Cave\b.*/;

	// Helper function to format location encounters
	function formatLocationEncounters(locationData, interaction) {
		let slicedLocations = locationData;
		let slicedNote = "";

		if (slicedLocations.length == 0) return "";

		const botChannel =
			process.env.NODE_ENV === "production" ? botChannelProd : botChannelDev;

		// Truncate the response when not in the bot channel.
		if (interaction.channel.id !== botChannel && locationData.length > 4) {
			slicedLocations = locationData.slice(0, 3);
			slicedNote =
				"**Note:** Encounters have been truncated. Run this command in the bot channel to see all encounters. ";
		}

		return (
			slicedLocations
				.map((location) => {
					const encounters = location.encounters
						.map((encounter) => {
							const encounterType =
								reverseEncounterTypeMap[encounter.type] || encounter.type;
							return `${encounterType}\nLevel: ${encounter.level} | Rate: ${encounter.rate}%`;
						})
						.join("\n");

					let locationTitle = location.location;
					if (solaceonRuinsRegex.test(locationTitle)) {
						locationTitle = locationTitle.replace(
							solaceonRuinsRegex,
							"Solaceon Ruins",
						);
					} else if (turnbackCaveRegex.test(locationTitle)) {
						locationTitle = locationTitle.replace(
							turnbackCaveRegex,
							"Turnback Cave",
						);
					}

					return `**${locationTitle}**\n${encounters}`;
				})
				.join("\n\n") + `\n\n${slicedNote}`
		);
	}

	// Get static encounter information
	const staticEncounters = getStaticLocations(pokemonInfo.name);
	const formattedStaticEncounters =
		staticEncounters.length > 0
			? `${staticEncounters
					.map((location) => {
						const replacedName = staticNameReplacements[location] || location;
						return `${replacedName}`;
					})
					.join("\n\n")}\n\n`
			: "";

	// If nothing found, check mon is valid, if so, try getting the location of its earliest evolution that appears in the wild.
	if (locations.length === 0 && staticEncounters.length === 0) {
		if (pokemonInfo.isValid === 0) {
			embed.setDescription(
				`*This Pokemon is* ***not*** *available in 2.0F.*\n\nSorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
			);
		} else {
			const evolutionDetails = getEvolutionTree(monsID);

			if (monsID !== evolutionDetails.pokemonId) {
				const locationsBackup = getEncounterLocations(
					evolutionDetails.pokemonId,
				);

				if (locationsBackup.length === 0 && staticEncounters.length === 0) {
					embed.setDescription(
						`Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
					);
				} else {
					const backupName = getPokemonDisplayName(evolutionDetails.pokemonId);
					embed.setDescription(
						`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n${formatLocationEncounters(
							locations,
							interaction,
						)}${formattedStaticEncounters}**${backupName}** can be found:\n\n${formatLocationEncounters(
							locationsBackup,
							interaction,
						)}See more in the [Pokédex](https://luminescent.team/pokedex/${monsID}).`,
					);
				}
			} else {
				embed.setDescription(
					`Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
				);
			}
		}
	} else {
		embed.setDescription(
			`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n${formatLocationEncounters(
				locations,
				interaction,
			)}${formattedStaticEncounters}See more in the [Pokédex](https://luminescent.team/pokedex/${monsID}).`,
		);
	}

	return embed;
}

module.exports = { locationMode };

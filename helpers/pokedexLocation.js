const { EmbedBuilder } = require("discord.js");
const {
	getEncounterLocations,
	getEvolutionTree,
	getPokemonDisplayName,
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

	// If nothing found, check mon is valid, if so, try getting the location of its earliest evolution that appears in the wild.
	if (locations.length === 0) {
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

				if (locationsBackup.length === 0) {
					embed.setDescription(
						`Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
					);
				} else {
					const backupName = getPokemonDisplayName(evolutionDetails.pokemonId);
					embed.setDescription(
						`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n**${backupName}** can be found:\n\n${formatLocationEncounters(
							locationsBackup,
							interaction,
						)}[See more in Pokédex](https://luminescent.team/pokedex/${monsID})`,
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
			)}[See more in Pokédex](https://luminescent.team/pokedex/${monsID})`,
		);
	}

	return embed;
}

module.exports = { locationMode };

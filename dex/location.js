const { encounterData, staticLocations } = require(global.gameDataFolder);
const cityAndTownNames = [
	"Twinleaf Town",
	"Sandgem Town",
	"Jubilife City",
	"Oreburgh City",
	"Floaroma Town",
	"Eterna City",
	"Veilstone City",
	"Celestic Town",
	"Pastoria City",
	"Hearthome City",
	"Solaceon Town",
	"Canalave City",
	"Snowpoint City",
	"Sunyshore City",
	"Pokemon League",
];
const locationsToFilter = ["Lake Verity (Before)"];
const staticEncounters = {
	"lmpt-0": ["Turtwig", "Chimchar", "Piplup"],
	"lmpt-1": ["Eevee"],
	"lmpt-4": [
		// Trainer School Egg has all of these
		"Pichu",
		"Cleffa",
		"Igglybuff",
		"Smoochum",
		"Tyrogue",
		"Smoochum",
		"Elekid",
		"Magby",
		"Azurill",
		"Wynaut",
		"Chingling",
		"Bonsly",
		"Mime Jr.",
		"Munchlax",
		"Mantyke",
	],
	"lmpt-5": ["Turtwig", "Chimchar", "Piplup"],
	"lmpt-7": ["Bulbasaur", "Charmander", "Squirtle", "Wobbuffet"],
	"lmpt-10": ["Treecko", "Torchic", "Mudkip", "Beldum"],
	"lmpt-11": [
		"Omanyte",
		"Kabuto",
		"Lileep",
		"Anorith",
		"Shieldon",
		"Cranidos",
		"Aerodactyl",
	],
	"lmpt-13": ["Crystal Onix"],
	"lmpt-14": ["Chikorita", "Cyndaquil", "Totodile"],
	"lmpt-108": ["Porygon"],
	"lmpt-20": ["Stitched Gengar", "Rotom"],
	"lmpt-22": ["Gabite"],
	"lmpt-27": [
		// Eterna City Egg
		"Riolu",
		"Budew",
		"Happiny",
		"Togepi",
	],
	"lmpt-28": ["Spiritomb"],
	"lmpt-29": ["Ditto"],
	"lmpt-31": ["Litwick"],
	"lmpt-41": ["Pichu"],
	"lm9pt-4": ["Azelf"],
	"lmpt-55": ["Uxie"],
	"lmpt-56": ["Dialga", "Palkia"],
	"lmpt-62": ["Lapras"],
	"lmpt-63": [
		"Zubat",
		"Psyduck",
		"Machop",
		"Geodude",
		"Murkrow",
		"Bidoof",
		"Kricketot",
		"Shinx",
		"Budew",
		"Pachirisu",
		"Buneary",
		"Lickitung",
		"Magnemite",
		"Rhyhorn",
		"Houndoom",
		"Swablu",
		"Absol",
		"Golbat",
		"Hoothoot",
		"Bibarel",
		"Chingling",
		"Stunky",
		"Skuntank",
		"Machoke",
		"Graveler",
		"Aipom",
		"Wingull",
		"Munchlax",
		"Purugly",
		"Pelipper",
		"Luxio",
		"Glameow",
		"Mantyke",
		"Wurmple",
		"Silcoon",
		"Roselia",
		"Combee",
		"Cherubi",
		"Scyther",
		"Pinsir",
		"Buizel",
		"Shellos",
		"Gastrodon",
		"Togepi",
		"Ralts",
		"Barboach",
		"Wooper",
		"Quagsire",
		"Tentacool",
		"Tentracruel",
		"Gible",
		"Octillery",
		"Whiscash",
		"Gabite",
		"Onix",
		"Skorupi",
		"Gligar",
		"Teddiursa",
		"Bronzor",
		"Hippopotas",
		"Magby",
		"Ponyta",
		"Croagunk",
		"Swinub",
		"Gastly",
		"Misdreavus",
		"Smoochum",
		"Elekid",
		"Duskull",
		"Meditie",
		"Kadabra",
		"Girafarig",
		"Mr. Mime",
		"Snorunt",
		"Glalie",
		"Sneasel",
		"Snover",
	],
	"lmpt-65": ["Manaphy"],
	"lmpt-68": [],
	"lmpt-78": [],
	"lmpt-79": [],
	"lmpt-84": ["Articuno"],
	"lmpt-85": ["Zapdos"],
	"lmpt-86": ["Moltres"],
	"lmpt-87": ["Mewtwo"],
	"lmpt-88": ["Raikou"],
	"lmpt-89": ["Entei"],
	"lmpt-90": ["Suicune"],
	"lmpt-91": ["Lugia"],
	"lmpt-92": ["Ho-Oh"],
	"lmpt-93": ["Celebi"],
	"lmpt-94": ["Regirock", "Registeel", "Regice", "Regigigas"],
	"lmpt-95": ["Latios", "Latias", "Cresselia"],
	"lmpt-96": ["Kyogre"],
	"lmpt-97": ["Groudon"],
	"lmpt-98": ["Rayquaza"],
	"lmpt-99": ["Jirachi"],
	"lmpt-100": ["Deoxys"],
	"lmpt-101": ["Mesprit"],
	"lmpt-102": ["Heatran"],
	"lmpt-103": ["Giratina"],
	"lmpt-104": ["Darkrai"],
	"lmpt-105": ["Shaymin"],
	"lmpt-106": ["Arceus"],
	"lmpt-107": ["Tinkatuff"],
	"lmpt-109": ["Mew"],
};

function getEncounterLocations(monsNo) {
	if (!encounterData[monsNo]) {
		return [];
	}

	const locations = [];
	const groupedCitiesAndTowns = [];

	for (const location of encounterData[monsNo]) {
		let enc_type = location["encounterType"];
		let enc_location = location["routeName"];
		const enc_level = location["maxLevel"];
		let enc_rate = location["encounterRate"];

		// Convert the encounter rate to a numerical value.
		if (enc_rate === "morning") {
			enc_rate = 10;
			enc_type = "Morning";
		} else {
			enc_rate = parseInt(enc_rate.split("%")[0]);
		}

		const isRouteLocation = enc_location.toLowerCase().startsWith("route");
		const isCityOrTownLocation = cityAndTownNames.includes(enc_location);

		const nameWithFloor = enc_location.match(/.*?(?=\s-)|.*/i);
		const mainLocationName = nameWithFloor ? nameWithFloor[0] : enc_location;
		const mainLocationNamePattern = new RegExp(
			mainLocationName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
			"i",
		);

		// Compress locations with similar names, encounter types and levels.
		const similarLocation = locations.find((loc) =>
			loc.encounters.some(
				(enc) =>
					enc.type === enc_type &&
					enc.level === enc_level &&
					((isRouteLocation &&
						loc.location.toLowerCase().startsWith("route")) ||
						(!isRouteLocation && mainLocationNamePattern.test(loc.location))),
			),
		);

		const existingEncounter = similarLocation
			? similarLocation.encounters.find(
					(enc) => enc.type === enc_type && enc.level === enc_level,
			  )
			: null;

		if (similarLocation && existingEncounter) {
			if (similarLocation.location === enc_location) {
				existingEncounter.rate += enc_rate;
			}
		} else {
			const targetArray = isCityOrTownLocation
				? groupedCitiesAndTowns
				: locations;

			const existingLocation = targetArray.find(
				(loc) => loc.location === enc_location,
			);

			if (existingLocation) {
				existingLocation.encounters.push({
					type: enc_type,
					level: enc_level,
					rate: enc_rate,
				});
			} else {
				targetArray.push({
					location: enc_location,
					encounters: [
						{
							type: enc_type,
							level: enc_level,
							rate: enc_rate,
						},
					],
				});
			}
		}
	}

	const groupedLocations = groupLocations(locations);
	const mergedLocations = mergeCitiesAndTowns(
		groupedCitiesAndTowns,
		groupedLocations,
	);
	const cleanedLocations = cleanLocations(mergedLocations);
	const optimizedLocations = optimizeLocations(cleanedLocations);

	return optimizedLocations;
}

function groupLocations(locations) {
	// Group all locations that have the same locations names in the array.
	const groupedLocations = [];
	for (const location of locations) {
		const existingGroupedLocation = groupedLocations.find(
			(loc) => loc.location === location.location,
		);

		if (existingGroupedLocation) {
			existingGroupedLocation.encounters.push(...location.encounters);
		} else {
			groupedLocations.push(location);
		}
	}

	return groupedLocations;
}

function mergeCitiesAndTowns(groupedCitiesAndTowns, groupedLocations) {
	// Group all locations within the CitiesAndTowns array and merge with the previous array.
	const mergedCitiesAndTowns = [];
	const encounterMap = new Map();

	for (const location of groupedCitiesAndTowns) {
		const key = `${location.encounters[0].type}-${location.encounters[0].level}-${location.encounters[0].rate}`;

		if (encounterMap.has(key)) {
			const existingLocationIndex = encounterMap.get(key);
			mergedCitiesAndTowns[
				existingLocationIndex
			].location += `, ${location.location}`;
		} else {
			encounterMap.set(key, mergedCitiesAndTowns.length);
			mergedCitiesAndTowns.push(location);
		}
	}
	groupedLocations.unshift(...mergedCitiesAndTowns);

	return groupedLocations;
}

function cleanLocations(groupedLocations) {
	// Clean and compress location names for visability.
	const cleanedLocations = groupedLocations.map((location) => {
		const mainLocationName = location.location.match(/.*?(?=\s-)|.*/i)[0];
		let encounteredMainName = false;

		const cleanedName = location.location.replace(
			new RegExp(mainLocationName, "g"),
			(match) => {
				if (
					!location.location.toLowerCase().startsWith("route") &&
					encounteredMainName &&
					match.trim() === mainLocationName.trim()
				) {
					return "";
				} else {
					encounteredMainName = true;
					return match;
				}
			},
		);

		// Clean up extra instances of the hyphen.
		const cleanedNameWithoutExtraHyphen = cleanedName.replace(
			/-\s?/g,
			(match, offset) => {
				if (offset > 0) {
					return "";
				} else {
					return match;
				}
			},
		);

		// Clean up extra instances of the word 'Route'.
		const cleanedNameWithoutExtraRoute = cleanedNameWithoutExtraHyphen.replace(
			/Route\s/gi,
			(match, offset) => {
				if (offset > 0) {
					return "";
				} else {
					return match;
				}
			},
		);

		const cleanedNameWithoutAfter = cleanedNameWithoutExtraRoute.replace(
			/\s?\(after\)/gi,
			"",
		);

		return { ...location, location: cleanedNameWithoutAfter };
	});

	return cleanedLocations;
}

function optimizeLocations(cleanedLocations) {
	const optimizedLocations = [];
	// Separate the morning/day/night encounters from the other encounters and replace with 'ground_mons' if they all exist with the same rates.
	for (const location of cleanedLocations) {
		const { location: locName, encounters: originalEncounters } = location;

		const morningDayNightEncounters = originalEncounters.filter(
			(enc) =>
				enc.type === "Morning" || enc.type === "day" || enc.type === "night",
		);

		const otherEncounters = originalEncounters.filter(
			(enc) =>
				enc.type !== "Morning" && enc.type !== "day" && enc.type !== "night",
		);

		const sameRateAndLevel =
			morningDayNightEncounters.length === 3 &&
			morningDayNightEncounters.every(
				(enc, index, arr) =>
					enc.rate === arr[0].rate && enc.level === arr[0].level,
			);

		if (sameRateAndLevel) {
			const groundMonsEncounter = {
				type: "ground_mons",
				level: morningDayNightEncounters[0].level,
				rate: morningDayNightEncounters[0].rate,
			};

			const existingGroundMonsIndex = otherEncounters.findIndex(
				(enc) =>
					enc.type === "ground_mons" && enc.level === groundMonsEncounter.level,
			);

			if (existingGroundMonsIndex !== -1) {
				otherEncounters[existingGroundMonsIndex].rate +=
					groundMonsEncounter.rate;
			} else {
				otherEncounters.push(groundMonsEncounter);
			}

			optimizedLocations.push({
				location: locName,
				encounters: otherEncounters,
			});
		} else {
			optimizedLocations.push(location);
		}
	}

	const filteredLocations = optimizedLocations.filter(
		(location) => !locationsToFilter.includes(location.location),
	);

	return filteredLocations;
}

function getStaticLocations(pokemonName) {
	const locations = [];

	for (const staticEntry of staticLocations.statics) {
		if (staticEntry.filterKey in staticEncounters) {
			const pokemonList = staticEncounters[staticEntry.filterKey];
			if (pokemonList.includes(pokemonName)) {
				locations.push(staticEntry.location);
			}
		}
	}

	return locations;
}

module.exports = { getEncounterLocations, getStaticLocations };

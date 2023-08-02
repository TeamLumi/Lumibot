const { encounterData } = require("../../lumibot/__gamedata");

function getEncounterLocations(monsNo) {
	// If the Pokémon number is not found, return an empty array
	if (!encounterData[monsNo]) {
		return [];
	}

	// Rename the encounter types
	const reverseEncounterTypeMap = {
		ground_mons: "<:grass:1136228499477246043> Walking",
		swayGrass: "<:pokeradar:1136357617074180116> Radar",
		tairyo: ":tv: Swarm",
		water_mons: ":ocean: Surfing",
		boro_mons: "<:oldrod:1136220484304896001> Old Rod",
		ii_mons: "<:goodrod:1136220559856906400> Good Rod",
		sugoi_mons: "<:superrod:1136220619432792097> Super Rod",
		day: ":sunny: Day",
		night: ":crescent_moon: Night",
		Morning: ":sunrise_over_mountains: Morning",
		"Honey Tree": ":honey_pot: Honey Tree",
		Incense: "<:incense:1136358228356243506> Incense",
	};

	const locations = [];

	for (const location of encounterData[monsNo]) {
		let enc_type = location["encounterType"];
		let enc_location = location["routeName"];

		const enc_level = location["maxLevel"];
		let enc_rate = location["encounterRate"];

		// Convert the encounter rate to a numerical value
		if (enc_rate === "morning") {
			enc_rate = 10;
			enc_type = "Morning";
		} else {
			enc_rate = parseInt(enc_rate.split("%")[0]);
		}

		const enc_type_altered = reverseEncounterTypeMap[enc_type] || enc_type;

		// Compress locations with similar encounter types and levels
		const similarLocation = locations.find((loc) =>
			loc.encounters.some(
				(enc) => enc.type === enc_type_altered && enc.level === enc_level,
			),
		);

		if (similarLocation) {
			const existingEncounter = similarLocation.encounters.find(
				(enc) => enc.type === enc_type_altered && enc.level === enc_level,
			);
			if (existingEncounter) {
				// Only update the encounter rate if the location names are the same
				if (similarLocation.location === enc_location) {
					existingEncounter.rate += enc_rate;
				}
			} else {
				similarLocation.encounters.push({
					type: enc_type_altered,
					level: enc_level,
					rate: enc_rate,
				});
			}

			// Add the floor or location information to the existing location's name
			if (!similarLocation.location.includes(enc_location)) {
				similarLocation.location += `, ${enc_location}`;
			}
		} else {
			locations.push({
				location: enc_location,
				encounters: [
					{
						type: enc_type_altered,
						level: enc_level,
						rate: enc_rate,
					},
				],
			});
		}
	}
	// Group all locations that have the same names after creating an array as above
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
	// New: Clean and compress location names
	const cleanedLocations = groupedLocations.map((location) => {
		const nameWithFloor = location.location.match(
			/.*?(?=\s\d+F\b)|.*?(?=\s\()/i,
		);
		const mainLocationName = nameWithFloor
			? nameWithFloor[0]
			: location.location;
		let encounteredMainName = false;

		const cleanedName = location.location.replace(
			new RegExp(mainLocationName, "g"),
			(match) => {
				if (encounteredMainName && match === mainLocationName) {
					return "";
				} else {
					encounteredMainName = true;
					return match;
				}
			},
		);

		return { ...location, location: cleanedName };
	});

	return cleanedLocations;
}

module.exports = { getEncounterLocations };

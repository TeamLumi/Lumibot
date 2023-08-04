const { encounterData } = require("../../lumibot/__gamedata");

function getEncounterLocations(monsNo) {
	// If the Pokémon number is not found, return an empty array
	if (!encounterData[monsNo]) {
		return [];
	}

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

		const isRouteLocation = enc_location.toLowerCase().startsWith("route");

		const nameWithFloor = enc_location.match(/.*?(?=\s-)|.*/i);
		const mainLocationName = nameWithFloor ? nameWithFloor[0] : enc_location;
		const mainLocationNamePattern = new RegExp(
			mainLocationName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
			"i",
		);

		// Compress locations with similar encounter types and levels
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

		if (similarLocation) {
			const existingEncounter = similarLocation.encounters.find(
				(enc) => enc.type === enc_type && enc.level === enc_level,
			);
			if (existingEncounter) {
				// Only update the encounter rate if the location names are the same
				if (similarLocation.location === enc_location) {
					existingEncounter.rate += enc_rate;
				}
			} else {
				similarLocation.encounters.push({
					type: enc_type,
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
						type: enc_type,
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

	// Clean and compress location names
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

		// Clean up extra instances of the hyphen
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

		// Clean up extra instances of the word 'Route'
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

		return { ...location, location: cleanedNameWithoutExtraRoute };
	});

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
			optimizedLocations.push({
				location: locName,
				encounters: [
					{
						type: "ground_mons",
						level: morningDayNightEncounters[0].level,
						rate: morningDayNightEncounters[0].rate,
					},
					...otherEncounters,
				],
			});
		} else {
			optimizedLocations.push(location);
		}
	}

	return optimizedLocations;
}

module.exports = { getEncounterLocations };

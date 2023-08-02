const { encounterData } = require("../../lumibot/__gamedata");

function getEncounterLocations(monsNo) {
	// If the Pokémon number is not found, return an empty array
	if (!encounterData[monsNo]) {
		return [];
	}

	// Rename the encounter types
	const reverseEncounterTypeMap = {
		ground_mons: "Grass",
		swayGrass: "Radar",
		tairyo: "Swarm",
		water_mons: "Surfing",
		boro_mons: "Old Rod",
		ii_mons: "Good Rod",
		sugoi_mons: "Super Rod",
	};

	const locations = [];
	const enc_obj = {}

	for (const location of encounterData[monsNo]) {
		let enc_type = location["encounterType"];
		let enc_location = location["routeName"];

		const enc_type_altered = reverseEncounterTypeMap[enc_type] || enc_type;

		const enc_level = location["maxLevel"];
		let enc_rate = location["encounterRate"];

		// Convert the encounter rate to a numerical value
		if (enc_rate === "morning") {
			enc_rate = 10;
			enc_type = "Morning";
		} else {
			enc_rate = parseInt(enc_rate.split("%")[0]);
		}

		// Store the encounter details in the 'locations' array
		if (!(enc_location in enc_obj)) {
			enc_obj[enc_location] = [{
				type: enc_type_altered,
				level: enc_level,
				rate: enc_rate,
			}];
		} else {
			enc_obj[enc_location].push({
				type: enc_type_altered,
				level: enc_level,
				rate: enc_rate,
			})
		};
	};
	for (const enc_key of Object.keys(enc_obj)) {
		const nest_array = enc_obj[enc_key];
		const route_obj = {};
		const level_obj = {};
	
		for (const enc_type of nest_array) {
			level_obj[enc_key] = enc_type.level;
			const key = `${enc_key}|${enc_type.type}`;
			route_obj[key] = (route_obj[key] || 0) + enc_type.rate;
		}
	
		for (const key of Object.keys(route_obj)) {
			const [location, enc_type] = key.split("|");
			const enc_level = level_obj[location];
			const rate = route_obj[key];
			locations.push({
				location: location,
				type: enc_type,
				level: enc_level,
				rate: `${rate}%`,
			});
		}
	}	
	return locations;
}

module.exports = { getEncounterLocations };

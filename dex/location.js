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
		locations.push({
			location: enc_location,
			type: enc_type_altered,
			level: enc_level,
			rate: `${enc_rate}%`,
		});
	}

	return locations;
}

module.exports = { getEncounterLocations };

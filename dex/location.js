const { encounterData } = require("../../lumibot/__gamedata");

function getEncounterLocations(monsNo) {
	// If the Pokémon number is not found, return an empty array
	if (!encounterData[monsNo]) {
		return [];
	}

	// Rename the encounter types
	const reverseEncounterTypeMap = {
		ground_mons: "<:grass:1136228499477246043>",
		swayGrass: ":red_envelope",
		tairyo: ":tv:",
		water_mons: ":ocean",
		boro_mons: "<:oldrod:1136220484304896001>",
		ii_mons: "<:goodrod:1136220559856906400>",
		sugoi_mons: "<:superrod:1136220619432792097>",
		day: ":sunny:",
		night: ":crescent_moon:",
		Morning: ":sunrise_over_mountains:",
		"Honey Tree": ":honey_pot:",
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

		// Find existing location entry in the 'locations' array
		const existingLocation = locations.find(
			(loc) => loc.location === enc_location,
		);

		if (existingLocation) {
			// Find existing encounter in the 'encounters' array of the location
			const existingEncounter = existingLocation.encounters.find(
				(enc) => enc.type === enc_type_altered && enc.level === enc_level,
			);

			if (existingEncounter) {
				// Combine encounter rates if encounter type and level are the same
				existingEncounter.rate += enc_rate;
			} else {
				// Add new encounter to the 'encounters' array of the location
				existingLocation.encounters.push({
					type: enc_type_altered,
					level: enc_level,
					rate: enc_rate,
				});
			}
		} else {
			// Add new location entry to the 'locations' array
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

	return locations;
}

module.exports = { getEncounterLocations };

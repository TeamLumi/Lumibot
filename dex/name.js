const {
	PersonalTable,
	basePokemonNames,
	formPokemonNames,
} = require(global.gameDataFolder);
const { FORM_MAP } = require("./functions");

const POKEMON_NAME_MAP = PersonalTable.Personal.reduce(createPokemonMap, {});
const POKEMON_NAME_LIST = Object.values(POKEMON_NAME_MAP);
const DISPLAY_POKEMON_NAME_MAP = PersonalTable.Personal.reduce(
	createPokemonDisplayNameMap,
	{},
);

function createPokemonMap(pokemonNameMap, currentPokemon) {
	try {
		const { id } = currentPokemon;

		const baseFormName =
			basePokemonNames.labelDataArray[id]?.wordDataArray[0]?.str;
		if (typeof baseFormName === "string" && baseFormName.length > 0) {
			pokemonNameMap[id] = baseFormName;
			return pokemonNameMap;
		}

		const alternateFormName =
			formPokemonNames.labelDataArray[id]?.wordDataArray[0]?.str;
		if (typeof alternateFormName === "string" && alternateFormName.length > 0) {
			pokemonNameMap[id] = alternateFormName;
			return pokemonNameMap;
		}

		pokemonNameMap[id] = getFormNameOfProblematicPokemon(id);
		return pokemonNameMap;
	} catch (e) {
		throw Error(`${currentPokemon.id} - ${e}
		pulling from directory ${global.gameDataFolder}`);
	}
}

function createPokemonDisplayNameMap(pokemonNameMap, currentPokemon) {
	try {
		const { id } = currentPokemon;

		const baseFormName =
			basePokemonNames.labelDataArray[id]?.wordDataArray[0]?.str;
		if (typeof baseFormName === "string" && baseFormName.length > 0) {
			pokemonNameMap[id] = baseFormName;
			return pokemonNameMap;
		}

		const alternateFormName =
			formPokemonNames.labelDataArray[id]?.wordDataArray[0]?.str;
		if (typeof alternateFormName === "string" && alternateFormName.length > 0) {
			const basePokemonId = FORM_MAP[PersonalTable.Personal[id].monsno][0];
			const baseName =
				basePokemonNames.labelDataArray[basePokemonId]?.wordDataArray[0]?.str;

			let displayName = `${baseName} - ${alternateFormName}`;

			// Check if the alternate form name includes the base name
			if (alternateFormName.includes(baseName)) displayName = alternateFormName;

			pokemonNameMap[id] = displayName;
			return pokemonNameMap;
		}

		pokemonNameMap[id] = getFormNameOfProblematicPokemon(id);
		return pokemonNameMap;
	} catch (e) {
		throw Error(`${currentPokemon.id} - ${e}`);
	}
}

function getFormName(id = 0) {
	return POKEMON_NAME_MAP[id];
}

function getPokemonName(pokemonId = 0) {
	return POKEMON_NAME_LIST[pokemonId];
}

function getPokemonIdFromName(name = "Egg") {
	const id = Object.values(POKEMON_NAME_MAP).findIndex(e => e === name);
	return id === -1 ? 0 : id;
}

function getFormNameOfProblematicPokemon(id = 0) {
	if (global.gameDataFolder == "../__3.0gamedata") {
		switch (id) {
			case 1266:
				return "Ash-Greninja";
			case 1309:
				return "Meowstic-F";
			case 1335:
				return "Rockruff Own-Tempo";
			case 1466:
				return "Indeedee-F";
			case 1481:
				return "Basculegion-F";
			case 1483:
				return "Oinkologne-F";
			default:
				throw Error(`Bad Pokemon ID in PokemonNameMap: ${id})`);
		}
	} else {
		switch (id) {
			case 1242:
				return "Ash-Greninja";
			case 1285:
				return "Meowstic-F";
			case 1310:
				return "Rockruff Own-Tempo";
			case 1441:
				return "Indeedee-F";
			case 1454:
				return "Basculegion-F";
			case 1456:
				return "Oinkologne-F";
			default:
				throw Error(`Bad Pokemon ID in PokemonNameMap: ${id})`);
		}
	}
}

function getPokemonMonsnoFromName(pokemonName) {
	if (!pokemonName) return -1;
	return basePokemonNames.labelDataArray.findIndex(
		e => e.wordDataArray[0].str === pokemonName,
	);
}

function getPokemonMonsNoAndFormNoFromPokemonId(pokemonId = 0) {
	const { monsno } = PersonalTable.Personal[pokemonId];
	const formno = FORM_MAP[monsno].indexOf(pokemonId);
	return [monsno, formno];
}

function getPokemonNames(to, from = 0) {
	if (typeof to !== "number" || to < 0) return [];
	return POKEMON_NAME_LIST.slice(from, to);
}

function getPokemonFormId(monsno = 0, id) {
	return FORM_MAP[monsno]?.findIndex(e => e === id) ?? -1;
}

function getPokemonDisplayName(pokemonId = 0) {
	return DISPLAY_POKEMON_NAME_MAP[pokemonId];
}

function getPokemonIdFromDisplayName(displayName) {
	const id = Object.values(DISPLAY_POKEMON_NAME_MAP).findIndex(
		e => e === displayName,
	);
	return id === -1 ? 0 : id;
}

module.exports = {
	getPokemonMonsnoFromName,
	getFormName,
	getFormNameOfProblematicPokemon,
	getPokemonName,
	getPokemonMonsNoAndFormNoFromPokemonId,
	getPokemonIdFromName,
	getPokemonNames,
	getPokemonFormId,
	createPokemonMap,
	POKEMON_NAME_MAP,
	DISPLAY_POKEMON_NAME_MAP,
	getPokemonDisplayName,
	getPokemonIdFromDisplayName,
};

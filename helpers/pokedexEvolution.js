const { EmbedBuilder } = require("discord.js");
const {
	getEvolutionTree,
	getPokemonDisplayName,
	getEvolutionMethodDetail,
} = require("../dex/index.js");
const { typeColors, evoToEmojiMap } = require("./pokedexConstants.js");

function evolutionMode(pokemonInfo, monsID, imageLnk) {
	if (pokemonInfo.name === `Shedinja`) {
		const embed = new EmbedBuilder()
			.setTitle(`**${pokemonInfo.name}**`)
			.setDescription(`*Evolves from:*\n**Nincada**\nFree Space + Poké Ball`)
			.setThumbnail(imageLnk);

		const typeColor = typeColors[pokemonInfo.type1];
		if (typeColor) embed.setColor(typeColor);

		return embed;
	}

	const evolutionDetails = getEvolutionTree(monsID);

	function getEvolutionDescription(evolutionTree, targetPokemonId) {
		// Helper function to generate the evolution description for a single evolution stage
		function generateEvolutionStageDescription(evolutionDetails) {
			const description = [];

			const evoMethodDetail = getEvolutionMethodDetail(
				evolutionDetails.methodIds[0],
				evolutionDetails.methodParameters[0],
				evolutionDetails.levels[0],
			);

			// Create a regular expression pattern that matches all words to be replaced
			const pattern = new RegExp(Object.keys(evoToEmojiMap).join("|"), "gi");

			// Replace the matched words with their corresponding emojis
			const methodDescriptionWithEmojis = evoMethodDetail[0].method.replace(
				pattern,
				matchedWord => evoToEmojiMap[matchedWord],
			);

			// Handles Ninjask and Nincada
			const methodDescriptionRepaired = methodDescriptionWithEmojis.replace(
				/& Free Space \+ Poké Ball/g,
				" ",
			);

			description.push(`${methodDescriptionRepaired}\n`);

			return description;
		}

		function findPokemonInTree(tree, targetId) {
			if (tree.pokemonId === targetId) return tree;

			for (const evolution of tree.evolvesInto) {
				const result = findPokemonInTree(evolution, targetId);
				if (result) return result;
			}

			return null;
		}

		function findEvolutionDetails(tree, targetId) {
			const targetPokemon = findPokemonInTree(tree, targetId);

			if (!targetPokemon) return null;

			if (targetPokemon.pokemonId !== tree.pokemonId)
				return targetPokemon.evolutionDetails;

			return targetPokemon.evolutionDetails;
		}

		const targetPokemon = findPokemonInTree(evolutionTree, targetPokemonId);

		if (!targetPokemon) return "Pokemon not found in the evolution tree.";

		const description = [];

		function findImmediatePreviousEvolution(tree, targetId) {
			for (const evolution of tree.evolvesInto) {
				if (evolution.pokemonId === targetId) return tree;
				const result = findImmediatePreviousEvolution(evolution, targetId);
				if (result) return result;
			}
			return null;
		}

		if (targetPokemon.pokemonId !== evolutionTree.pokemonId) {
			const immediatePreviousEvolution = findImmediatePreviousEvolution(
				evolutionTree,
				targetPokemonId,
			);

			if (immediatePreviousEvolution) {
				description.push("*Evolves from:*");
				const previousEvolutionName = getPokemonDisplayName(
					immediatePreviousEvolution.pokemonId,
				);
				description.push(`**${previousEvolutionName}**`);
				const previousEvolutionDetails = findEvolutionDetails(
					immediatePreviousEvolution,
					targetPokemonId,
				);
				if (previousEvolutionDetails)
					description.push(
						generateEvolutionStageDescription(previousEvolutionDetails),
					);
			}
		}

		// Check if the target Pokemon has any evolutions
		if (targetPokemon.evolvesInto.length > 0) {
			description.push("*Evolves into:*");

			for (const evolution of targetPokemon.evolvesInto) {
				const nextEvoName = getPokemonDisplayName(evolution.pokemonId);
				description.push(`**${nextEvoName}**`);
				description.push(
					generateEvolutionStageDescription(evolution.evolutionDetails),
				);
			}
		}

		if (description.length === 0)
			return "Sorry! This Pokémon is not known to evolve from or into anything.\n...At least not that I know of!\n\nSee more in the [Pokédex](https://luminescent.team/pokedex/${monsID}).";

		description.push(
			`See more in the [Pokédex](https://luminescent.team/pokedex/${monsID}).`,
		);

		return description.join("\n");
	}

	let evolutionDescription = getEvolutionDescription(evolutionDetails, monsID);

	if (pokemonInfo.isValid === 0) {
		evolutionDescription =
			"*This Pokemon is* ***not*** *available in 2.0F.*\n\n" +
			evolutionDescription;
	}

	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setDescription(`${evolutionDescription}`)
		.setThumbnail(imageLnk);

	const typeColor = typeColors[pokemonInfo.type1];
	if (typeColor) embed.setColor(typeColor);

	return embed;
}

module.exports = { evolutionMode };

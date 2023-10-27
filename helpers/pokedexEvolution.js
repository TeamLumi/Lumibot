const { EmbedBuilder } = require("discord.js");
const {
	getPokemonIdFromDisplayName,
	getPokemonInfo,
	generateMovesViaLearnset,
	getEvolutionTree,
	getPokemonDisplayName,
	getEvolutionMethodDetail,
} = require("../dex/index.js");

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

// Rename the evolution types
// prettier-ignore
const wordToEmojiMap = {
	"Water Stone": "<:waterstone:1157321781036720249> Water Stone",
	"Fire Stone": "<:firestone:1157321773235323001> Fire Stone",
	"Thunder Stone": "<:thunderstone:1157321778004238418> Thunder Stone",
	"Leaf Stone": "<:leafstone:1157321776045494273> Leaf Stone",
	"Ice Stone": "<:icestone:1157321774434885693> Ice Stone",
	"Moon Stone": "<:moonstone:1157323732570869850> Moon Stone",
	"Sun Stone": "<:sunstone:1157323733149679738> Sun Stone",
	"Dawn Stone": "<:dawnstone:1157322508903657622> Dawn Stone",
	"Shiny Stone": "<:shinystone:1157321777299603599> Shiny Stone",
	"Friendship": "<:soothebell:1157323348108390411> Friendship",
	"Fairy Move": "<:fairytm:1157321780038467645> Fairy Move",
	"Day": "<:Sun:1157324258519818332> Day",
	"Night": "<:Moon:1157324256988889221> Night",
	"Level": "<:rarecandy:1157320353677328406> Level",
	"Male": "<:male:1157322687320965221> Male",
	"Female": "<:female:1157322686234640404> Female",
};

function evolutionMode(pokemonInfo, monsID, imageLnk) {
	if (pokemonInfo.name === `Shedinja`) {
		const embed = new EmbedBuilder()
			.setTitle(pokemonInfo.name)
			.setDescription(`*Evolves from:*\n**Nincada**\nFree Space + Poké Ball`)
			.setThumbnail(imageLnk);

		const typeColor = typeColors[pokemonInfo.type1];
		if (typeColor) {
			embed.setColor(typeColor);
		}

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
			const pattern = new RegExp(Object.keys(wordToEmojiMap).join("|"), "gi");

			// Replace the matched words with their corresponding emojis
			const methodDescriptionWithEmojis = evoMethodDetail[0].method.replace(
				pattern,
				(matchedWord) => wordToEmojiMap[matchedWord],
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
			if (tree.pokemonId === targetId) {
				return tree;
			}

			for (const evolution of tree.evolvesInto) {
				const result = findPokemonInTree(evolution, targetId);
				if (result) {
					return result;
				}
			}

			return null;
		}

		function findEvolutionDetails(tree, targetId) {
			const targetPokemon = findPokemonInTree(tree, targetId);

			if (!targetPokemon) {
				return null;
			}

			if (targetPokemon.pokemonId !== tree.pokemonId) {
				return targetPokemon.evolutionDetails;
			}

			return targetPokemon.evolutionDetails;
		}

		const targetPokemon = findPokemonInTree(evolutionTree, targetPokemonId);

		if (!targetPokemon) {
			return "Pokemon not found in the evolution tree.";
		}

		const description = [];

		function findImmediatePreviousEvolution(tree, targetId) {
			for (const evolution of tree.evolvesInto) {
				if (evolution.pokemonId === targetId) {
					return tree;
				}
				const result = findImmediatePreviousEvolution(evolution, targetId);
				if (result) {
					return result;
				}
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
				if (previousEvolutionDetails) {
					description.push(
						generateEvolutionStageDescription(previousEvolutionDetails),
					);
				}
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

		if (description.length === 0) {
			return "Sorry! This Pokémon is not known to evolve from or into anything.\n\n...At least not that I know of!";
		}

		return description.join("\n");
	}

	let evolutionDescription = getEvolutionDescription(evolutionDetails, monsID);

	if (pokemonInfo.isValid === 0) {
		evolutionDescription =
			"*This Pokemon is* ***not*** *available in 2.0F.*\n\n" +
			evolutionDescription;
	}

	const embed = new EmbedBuilder()
		.setTitle(pokemonInfo.name)
		.setDescription(`${evolutionDescription}`)
		.setThumbnail(imageLnk);

	const typeColor = typeColors[pokemonInfo.type1];
	if (typeColor) {
		embed.setColor(typeColor);
	}

	return embed;
}

module.exports = { evolutionMode };

const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");
const {
	getPokemonIdFromDisplayName,
	getPokemonInfo,
} = require("../../../dex/index.js");
const { locationMode } = require("../../../helpers/pokedexLocation.js");
const { evolutionMode } = require("../../../helpers/pokedexEvolution.js");
const { learnsetMode } = require("../../../helpers/pokedexLearnset.js");
const {
	createGraphVisualization,
	createTextVisualization,
	statisticsMode,
} = require("../../../helpers/pokedexStatistics.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("pokedex")
		.setDescription("Retrieve information about a Pokemon")
		.addStringOption(option =>
			option
				.setName("pokemon")
				.setDescription("The name of the Pokemon")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.addStringOption(option =>
			option
				.setName("mode")
				.setDescription(
					"Additional pokedex functions for location and evolution etc.",
				)
				.setRequired(false)
				.addChoices(
					{ name: "statistics", value: "statistics" },
					{ name: "location", value: "location" },
					{ name: "learnset", value: "learnset" },
					{ name: "evolution", value: "evolution" },
				),
		)
		.addStringOption(option =>
			option
				.setName("visualization")
				.setDescription("The type of visualization (graph or table)")
				.setRequired(false)
				.addChoices(
					{ name: "graph", value: "graph" },
					{ name: "table", value: "table" },
				),
		),

	async execute(interaction) {
		let pokemonName = interaction.options.getString("pokemon");
		let monsID = getPokemonIdFromDisplayName(pokemonName);
		let pokemonInfo = getPokemonInfo(monsID);
		const visualization = interaction.options.getString("visualization");
		const mode = interaction.options.getString("mode");

		// Try capitalise only the first digit of the Pokemon's name to get data.
		if (pokemonInfo.name === "Egg") {
			pokemonName = pokemonName
				.toLowerCase()
				.replace(/(?:^|\s|-)\S/g, char => char.toUpperCase());

			monsID = getPokemonIdFromDisplayName(pokemonName) || 0;
			pokemonInfo = getPokemonInfo(monsID);
		}

		// Ignore pokemon that are still eggs after  error catching.
		if (pokemonInfo.name === "Egg") {
			const embed = new EmbedBuilder()
				.setTitle(`Oops!`)
				.setDescription(
					`I couldn't find that in the Pokédex. Perhaps there are still Pokémon yet to be discovered!`,
				)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/995539661084696626/1116076538480308244/shaymin_paradox_error.png",
				)
				.setColor(0x2664ea)
				.setFooter({
					text: "Thumbnail by @senpai_satan",
				});

			return interaction.reply({ embeds: [embed] });
		}

  		const pokemonPath = pokemonInfo.formno === 0 ? pokemonInfo.monsno : `${pokemonInfo.monsno}_${pokemonInfo.formno}`;
		const imageLnk = `https://luminescent.team${pokemonInfo.imageSrc}`;
		const pokedexText = {
			name: `BST: ${pokemonInfo.baseStatsTotal}`,
			value: `See more in the [Pokédex](https://luminescent.team/pokedex/${pokemonPath})`,
		};

		switch (mode) {
			case "location":
				embed = locationMode(pokemonInfo, monsID, imageLnk);
				break;
			case "evolution":
				embed = evolutionMode(pokemonInfo, monsID, imageLnk);
				break;
			case "learnset":
				embed = learnsetMode(pokemonInfo, monsID, imageLnk);
				break;
			default:
				embed = statisticsMode(pokemonInfo, monsID, imageLnk);
				if (visualization === "graph") {
					const image = await createGraphVisualization(pokemonInfo);
					const attachment = new AttachmentBuilder(image, {
						name: "chart.png",
					});
					embed.setImage("attachment://chart.png");
					embed.addFields(pokedexText);
					return interaction.reply({ embeds: [embed], files: [attachment] });
				} else {
					const textInfo = createTextVisualization(pokemonInfo);
					embed.addFields({
						name: "**Base Stats:**",
						value: textInfo,
					});
					embed.addFields(pokedexText);
				}
		}
		interaction.reply({ embeds: [embed] });
	},
};

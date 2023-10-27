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
		.addStringOption((option) =>
			option
				.setName("pokemon")
				.setDescription("The name of the Pokemon")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.addStringOption((option) =>
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
		.addStringOption((option) =>
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
		// Here we grab the Pokemon name then we convert it to the Pokemon's ID which we use to get further information.
		let pokemonName = interaction.options.getString("pokemon");
		let monsID = getPokemonIdFromDisplayName(pokemonName);
		let pokemonInfo = getPokemonInfo(monsID);
		const visualization = interaction.options.getString("visualization");
		const mode = interaction.options.getString("mode");

		if (pokemonInfo.name === "Egg") {
			pokemonName = pokemonName
				.toLowerCase()
				.replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase());

			monsID = getPokemonIdFromDisplayName(pokemonName) || 0;
			pokemonInfo = getPokemonInfo(monsID);
		}

		const imagePrefix = `https://luminescent.team`;
		const imageLnk = `${imagePrefix}${pokemonInfo.imageSrc}`;

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

		switch (mode) {
			case "location":
				embed = locationMode(pokemonInfo, monsID, imageLnk, interaction);
				break;
			case "evolution":
				embed = evolutionMode(pokemonInfo, monsID, imageLnk);
				break;
			case "learnset":
				embed = learnsetMode(pokemonInfo, monsID, imageLnk);
				break;
			default:
				embed = statisticsMode(pokemonInfo, imageLnk);
				if (visualization === "graph") {
					const image = await createGraphVisualization(pokemonInfo);
					const attachment = new AttachmentBuilder(image, {
						name: "chart.png",
					});
					embed.setImage("attachment://chart.png");
					interaction.reply({ embeds: [embed], files: [attachment] });
					return;
				} else {
					const textInfo = createTextVisualization(pokemonInfo);
					embed.addFields({
						name: "**Base Stats:**",
						value: textInfo,
					});
				}
		}

		interaction.reply({ embeds: [embed] });
	},
};

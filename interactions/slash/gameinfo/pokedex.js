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
		const pokemonInfo = getPokemonInfo(monsID);
		const visualization = interaction.options.getString("visualization");
		const mode = interaction.options.getString("mode");

		let {
			name,
			ability1,
			ability2,
			abilityH,
			tmLearnset,
			baseStatsTotal,
			weight: pWeight,
			height: pHeight,
			type1,
			type2,
			imageSrc,
			genderDecimalValue,
			isValid,
		} = pokemonInfo;
		let BackupInfo;

		if (name === "Egg") {
			pokemonName = pokemonName
				.toLowerCase()
				.replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase());

			BackupInfo = getPokemonInfo(getPokemonIdFromDisplayName(pokemonName));

			({
				name,
				ability1,
				ability2,
				abilityH,
				tmLearnset,
				baseStatsTotal,
				weight: pWeight,
				height: pHeight,
				type1,
				type2,
				imageSrc,
				genderDecimalValue,
				isValid,
			} = BackupInfo);

			monsID = getPokemonIdFromDisplayName(pokemonName) || 0;
		}

		const imagePrefix = `https://luminescent.team`;
		const imageLnk = `${imagePrefix}${imageSrc}`;

		// Ignore pokemon that are still eggs after  error catching.
		if (name === "Egg") {
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
				embed = locationMode(name, imageLnk, type1, monsID, isValid, interaction);
				break;
			case "evolution":
				embed = evolutionMode(name, imageLnk, type1, monsID, isValid);
				break;
			case "learnset":
				embed = learnsetMode(name, imageLnk, type1, monsID, isValid);
				break;
			default:
				embed = statisticsMode(
					name,
					imageLnk,
					ability1,
					ability2,
					abilityH,
					baseStatsTotal,
					type1,
					type2,
					isValid,
					genderDecimalValue
				);
				if (visualization === "graph") {
					const image = await createGraphVisualization(pokemonInfo, BackupInfo);
					const attachment = new AttachmentBuilder(image, { name: "chart.png" });
					embed.setImage("attachment://chart.png");
					interaction.reply({ embeds: [embed], files: [attachment] });
					return;
				} else {
					const textInfo = createTextVisualization(pokemonInfo, BackupInfo);
					embed.addFields({
						name: "**Base Stats:**",
						value: textInfo,
					});
				}
		}
		
		interaction.reply({ embeds: [embed] });
	},
};

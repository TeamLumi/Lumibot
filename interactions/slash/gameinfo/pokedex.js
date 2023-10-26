const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");
const {
	getPokemonIdFromDisplayName,
	getPokemonInfo,
	generateMovesViaLearnset,
	getEvolutionTree,
	getPokemonDisplayName,
	getEvolutionMethodDetail,
} = require("../../../dex/index.js");
const { CanvasRenderService } = require("chartjs-node-canvas");
const { locationMode } = require("../../../helpers/pokedexLocation.js");
const { evolutionMode } = require("../../../helpers/pokedexEvolution.js");
const { learnsetMode } = require("../../../helpers/pokedexLearnset.js");
const {
	createGraphVisualization,
	createTextVisualization,
	statisticsMode,
} = require("../../../helpers/pokedexStatistics.js");

// Array for pokemon types to set colours.
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

// Array for pokemon types to set icons.
// prettier-ignore
const typeIcons = {
	Grass: "<:t_grass:1117063031579488370>",
	Fire: "<:t_fire:1117063764487962624>",
	Water: "<:t_water:1117063766308298772>",
	Electric: "<:t_electric:1117063036268711957>",
	Ice: "<:t_ice:1117062636861927505>",
	Fighting: "<:t_fighting:1117063035224334426>",
	Poison: "<:t_poison:1117062634219524146>",
	Ground: "<:t_ground:1117062637566570538>",
	Flying: "<:t_flying:1117063032644845680>",
	Psychic: "<:t_psychic:1117062633191919657>",
	Bug: "<:t_bug:1117062630553702431>",
	Rock: "<:t_rock:1117062629282816061>",
	Ghost: "<:t_ghost:1117062639420452874>",
	Dragon: "<:t_dragon:1117062647439949875>",
	Dark: "<:t_dark:1117063037858353162>",
	Steel: "<:t_steel:1117062632172683414>",
	Fairy: "<:t_fairy:1117062642964635698>",
	Normal: "<:t_normal:1117062635817554010>",
};

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

		if (mode === "location") {
			embed = locationMode(name, imageLnk, type1, monsID, isValid, interaction);
			return interaction.reply({ embeds: [embed] });
		} else if (mode === "evolution") {
			embed = evolutionMode(name, imageLnk, type1, monsID, isValid);
			return interaction.reply({ embeds: [embed] });
		} else if (mode === "learnset") {
			embed = learnsetMode(name, imageLnk, type1, monsID, isValid);
			return interaction.reply({ embeds: [embed] });
		} else {
			const embed = statisticsMode(
				name,
				imageLnk,
				ability1,
				ability2,
				abilityH,
				baseStatsTotal,
				type1,
				type2,
				isValid,
				genderDecimalValue,
			);
			if (visualization === "graph") {
				const image = await createGraphVisualization(pokemonInfo, BackupInfo);
				const attachment = new AttachmentBuilder(image, { name: "chart.png" });
				embed.setImage("attachment://chart.png");
				interaction.reply({ embeds: [embed], files: [attachment] });
			} else {
				const textInfo = createTextVisualization(pokemonInfo, BackupInfo);
				embed.addFields({
					name: "**Base Stats:**",
					value: textInfo,
				});
				return interaction.reply({ embeds: [embed] });
			}
		}
	},
};

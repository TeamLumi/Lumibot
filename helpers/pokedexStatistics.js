const { EmbedBuilder } = require("discord.js");
const { CanvasRenderService } = require("chartjs-node-canvas");

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

function createGraphVisualization(pokemonInfo) {
	const stats = ["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => {
		const statValue =
			pokemonInfo.baseStats[stat] !== 0
				? pokemonInfo.baseStats[stat]
				: BackupInfo.baseStats[stat];
		return statValue;
	});

	const width = 240;
	const height = 240;

	const canvasRenderService = new CanvasRenderService(
		width,
		height,
		(ChartJS) => {},
	);

	const labels = [
		`HP: ${stats[0]}`,
		`Atk: ${stats[1]}`,
		`Def: ${stats[2]}`,
		`Sp.Atk: ${stats[3]}`,
		`Sp.Def: ${stats[4]}`,
		`Spd: ${stats[5]}`,
	];

	const configuration = {
		type: "radar",
		data: {
			labels,
			datasets: [
				{
					data: stats,
					backgroundColor: "rgba(152,187,219,100)",
					borderColor: "rgba(152,187,219,255)",
					borderWidth: 2.0,
					pointRadius: 0,
				},
			],
		},
		options: {
			scale: {
				ticks: {
					display: false,
					beginAtZero: true,
					max: 260,
					stepSize: 260,
				},
				angleLines: {
					display: true,
					color: "rgba(102,121,207,255)",
				},
				gridLines: {
					display: true,
					color: "rgba(102,121,207,255)",
				},
				pointLabels: {
					display: true,
					padding: 15,
					fontColor: "rgba(255, 255, 255, 255)",
					fontSize: 11,
					fontStyle: "bold",
				},
			},
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 15,
				},
			},
			legend: {
				display: false,
			},
		},
	};

	return canvasRenderService.renderToBuffer(configuration);
}

function createTextVisualization(pokemonInfo) {
	const statValues = ["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => {
		const statValue = String(
			pokemonInfo.baseStats[stat] !== 0
				? pokemonInfo.baseStats[stat]
				: BackupInfo.baseStats[stat],
		).padEnd(3, " ");
		return statValue;
	});

	return `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${statValues[0]}│${statValues[1]}│${statValues[2]}│${statValues[3]}│${statValues[4]}│${statValues[5]}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``;
}

function statisticsMode(pokemonInfo, monsID, imageLnk) {
	const embed = new EmbedBuilder()
		.setTitle(`**${pokemonInfo.name}**`)
		.setThumbnail(imageLnk);

	let malePercentage;
	let femalePercentage;

	if (pokemonInfo.genderDecimalValue === 255) {
		malePercentage = 0;
		femalePercentage = 0;
	} else {
		const totalPossibleValues = 254;
		const femaleValue = pokemonInfo.genderDecimalValue;
		const maleValue = totalPossibleValues - pokemonInfo.genderDecimalValue;

		malePercentage = Math.round((maleValue / totalPossibleValues) * 100);
		femalePercentage = Math.round((femaleValue / totalPossibleValues) * 100);
	}

	let genderText = "";
	if (malePercentage === 0 && femalePercentage === 0) {
		genderText = "Unknown";
	} else if (malePercentage === 100) {
		genderText = "100% Male";
	} else if (femalePercentage === 100) {
		genderText = "100% Female";
	} else {
		genderText = `${malePercentage}% Male, ${femalePercentage}% Female`;
	}

	const abilityField =
		pokemonInfo.ability1 === pokemonInfo.ability2
			? [{ name: "**Abilities:**", value: pokemonInfo.ability1, inline: true }]
			: [
					{
						name: "**Abilities:**",
						value: `${pokemonInfo.ability1}\n${pokemonInfo.ability2}`,
						inline: true,
					},
			  ];

	embed.addFields(
		...abilityField,
		{ name: "**Hidden Ability:**", value: pokemonInfo.abilityH, inline: true },
		{ name: "**Gender:**", value: `${genderText}` },
	);

	const typeColor = typeColors[pokemonInfo.type1];
	if (typeColor) {
		embed.setColor(typeColor);
	}

	const type1Icon = typeIcons[pokemonInfo.type1];
	const type2Icon = typeIcons[pokemonInfo.type2];

	const typeDescription =
		pokemonInfo.isValid === 0
			? `*This Pokemon is* ***not*** *available in 2.0F.*\n\n`
			: "";

	embed.setDescription(
		`${typeDescription}**Type:** ${type1Icon}${
			pokemonInfo.type1 !== pokemonInfo.type2 ? ` \u200b ${type2Icon}` : ""
		}`,
	);

	return embed;
}

module.exports = {
	createGraphVisualization,
	createTextVisualization,
	statisticsMode,
};

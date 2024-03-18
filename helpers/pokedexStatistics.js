const { EmbedBuilder } = require("discord.js");
const { CanvasRenderService } = require("chartjs-node-canvas");
const { typeColors, typeIcons } = require("./pokedexConstants.js");

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

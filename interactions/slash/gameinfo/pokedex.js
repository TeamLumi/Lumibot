const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");
const { getPokemonIdFromDisplayName } = require("../../../dex/index.js");
const { getPokemonInfo } = require("../../../dex/index.js");
const { CanvasRenderService } = require("chartjs-node-canvas");

// Array for pokemon types to set colours.
const typeColors = {
	Grass: "#A3B18A",
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
				.setName("visualization")
				.setDescription("The type of visualization (graph or table)")
				.setRequired(false)
				.addChoices(
					{ name: "Graph", value: "graph" },
					{ name: "Table", value: "table" },
				),
		),

	async execute(interaction) {
		// Here we grab the Pokemon name then we convert it to the Pokemon's ID which we use to get further information.
		const pokemonName = interaction.options.getString("pokemon");
		const monsID = getPokemonIdFromDisplayName(pokemonName);
		const pokemonInfo = getPokemonInfo(monsID);
		const visualization = interaction.options.getString("visualization");

		let name,
			ability1,
			ability2,
			abilityH,
			tmLearnset,
			baseStatsTotal,
			pWeight,
			pHeight,
			type1,
			type2,
			imageSrc,
			imageLnk,
			genderDecimalValue;

		// Here we default to the string conversion method of getting Pokemon info if you manage to avoid the autocomplete. Else set normally.
		if (pokemonInfo.name === "Egg") {
			const pokemonBackupName = interaction.options
				.getString("pokemon")
				.toLowerCase();
			const pokemonBackupNameCapital = pokemonBackupName.replace(
				/(?:^|\s|-)\S/g,
				(char) => char.toUpperCase(),
			);
			const monsBackupID = getPokemonIdFromDisplayName(
				pokemonBackupNameCapital,
			);
			const pokemonBackupInfo = getPokemonInfo(monsBackupID);

			name = pokemonBackupInfo.name;
			ability1 = pokemonBackupInfo.ability1;
			ability2 = pokemonBackupInfo.ability2;
			abilityH = pokemonBackupInfo.abilityH;
			tmLearnset = pokemonBackupInfo.tmLearnset;
			baseStatsTotal = pokemonBackupInfo.baseStatsTotal;
			pWeight = pokemonBackupInfo.weight;
			pHeight = pokemonBackupInfo.height;
			type1 = pokemonBackupInfo.type1;
			type2 = pokemonBackupInfo.type2;
			imageSrc = pokemonBackupInfo.imageSrc;
			imagePrefix = `https://luminescent.team`;
			imageLnk = `${imagePrefix}${imageSrc}`;
			genderDecimalValue = pokemonBackupInfo.genderDecimalValue;
		} else {
			name = pokemonInfo.name;
			ability1 = pokemonInfo.ability1;
			ability2 = pokemonInfo.ability2;
			abilityH = pokemonInfo.abilityH;
			tmLearnset = pokemonInfo.tmLearnset;
			baseStatsTotal = pokemonInfo.baseStatsTotal;
			pWeight = pokemonInfo.weight;
			pHeight = pokemonInfo.height;
			type1 = pokemonInfo.type1;
			type2 = pokemonInfo.type2;
			imageSrc = pokemonInfo.imageSrc;
			imagePrefix = `https://luminescent.team`;
			imageLnk = `${imagePrefix}${imageSrc}`;
			genderDecimalValue = pokemonInfo.genderDecimalValue;
		}

		// Ignore pokemon that are still eggs after  error catching.
		if (name === "Egg") {
			const embed = new EmbedBuilder()
				.setTitle(`Oops!`)
				.setDescription(
					`I couldn't find that in the Pokédex. \nPerhaps there are still Pokémon yet \u00A0 \u00A0\nto be discovered!`,
				)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/995539661084696626/1116076538480308244/shaymin_paradox_error.png",
				)
				.setColor(0x2664ea);

			return interaction.reply({ embeds: [embed] });
		}

		let malePercentage;
		let femalePercentage;

		if (genderDecimalValue === 255) {
			malePercentage = 0;
			femalePercentage = 0;
		} else {
			const totalPossibleValues = 254;
			const femaleValue = genderDecimalValue;
			const maleValue = totalPossibleValues - genderDecimalValue;

			malePercentage = Math.round((maleValue / totalPossibleValues) * 100);
			femalePercentage = Math.round((femaleValue / totalPossibleValues) * 100);
		}

		const embed = new EmbedBuilder().setTitle(name).setThumbnail(imageLnk);

		if (ability1 === ability2) {
			embed.addFields(
				{ name: `**Abilties:**`, value: `${ability1}`, inline: true },
				{ name: `**Hidden Ability:**`, value: `${abilityH}`, inline: true },
			);
		} else {
			embed.addFields(
				{
					name: `**Abilties:**`,
					value: `${ability1}\n${ability2}`,
					inline: true,
				},
				{ name: `**Hidden Ability:**`, value: `${abilityH}`, inline: true },
			);
		}

		embed.addFields({ name: `**Stats:**`, value: `Total: ${baseStatsTotal}` });

		const typeColor = typeColors[type1];
		if (typeColor) {
			embed.setColor(typeColor);
		}

		if (type1 === type2) {
			const type1Icon = typeIcons[type1];
			embed.setDescription(`**Type:** ${type1Icon}`);
		} else {
			const type1Icon = typeIcons[type1];
			const type2Icon = typeIcons[type2];
			embed.setDescription(`**Type:** ${type1Icon} \u200b ${type2Icon}`);
		}

		if (malePercentage === 0 && femalePercentage === 0) {
			embed.setFooter({ text: `Gender: Unknown` });
		} else if (malePercentage === 100) {
			embed.setFooter({ text: `Gender: 100% Male` });
		} else if (femalePercentage === 100) {
			embed.setFooter({ text: `Gender: 100% Female` });
		} else {
			embed.setFooter({
				text: `Gender: ${malePercentage}% Male, ${femalePercentage}% Female`,
			});
		}

		if (visualization === "graph") {
			const hp = pokemonInfo.baseStats.hp;
			const atk = pokemonInfo.baseStats.atk;
			const def = pokemonInfo.baseStats.def;
			const spa = pokemonInfo.baseStats.spa;
			const spd = pokemonInfo.baseStats.spd;
			const spe = pokemonInfo.baseStats.spe;

			const width = 240; // Define the width of the chart
			const height = 240; // Define the height of the chart

			const canvasRenderService = new CanvasRenderService(
				width,
				height,
				(ChartJS) => {},
			);

			// Define configuration for the chart
			const configuration = {
				type: "radar",
				data: {
					labels: [
						`Hp ${hp}`,
						`Atk\n${atk}`,
						`${def}\nDef`,
						`${spe} Spe`,
						`${spd}\nSpDef`,
						`SpAtk\n${spa}`,
					],
					datasets: [
						{
							data: [hp, atk, def, spe, spd, spa],
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
							diplay: true,
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
			const image = await canvasRenderService.renderToBuffer(configuration);
			const attachment = new AttachmentBuilder(image, { name: "chart.png" });
			embed.setImage("attachment://chart.png");

			interaction.reply({ embeds: [embed], files: [attachment] });
		} else {
			const hp = String(pokemonInfo.baseStats.hp).padEnd(3, " ");
			const atk = String(pokemonInfo.baseStats.atk).padEnd(3, " ");
			const def = String(pokemonInfo.baseStats.def).padEnd(3, " ");
			const spa = String(pokemonInfo.baseStats.spa).padEnd(3, " ");
			const spd = String(pokemonInfo.baseStats.spd).padEnd(3, " ");
			const spe = String(pokemonInfo.baseStats.spe).padEnd(3, " ");

			embed.addFields({
				name: `**Base Stats:**`,
				value: `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${hp}│${atk}│${def}│${spa}│${spd}│${spe}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``,
			});

			interaction.reply({ embeds: [embed] });
		}
	},
};

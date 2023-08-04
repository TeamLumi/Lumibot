const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");
const { getPokemonIdFromDisplayName } = require("../../../dex/index.js");
const { getPokemonInfo } = require("../../../dex/index.js");
const { getEncounterLocations } = require("../../../dex/index.js");
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

// Rename the encounter types
const reverseEncounterTypeMap = {
	ground_mons: "<:grass:1136228499477246043> Walking",
	swayGrass: "<:pokeradar:1136357617074180116> Radar",
	tairyo: ":tv: Swarm",
	water_mons: ":ocean: Surfing",
	boro_mons: "<:oldrod:1136220484304896001> Old Rod",
	ii_mons: "<:goodrod:1136220559856906400> Good Rod",
	sugoi_mons: "<:superrod:1136220619432792097> Super Rod",
	day: ":sunny: Day",
	night: ":crescent_moon: Night",
	Morning: ":sunrise_over_mountains: Morning",
	"Honey Tree": ":honey_pot: Honey Tree",
	Incense: "<:incense:1136358228356243506> Incense",
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
					{ name: "Statistics", value: "statistics" },
					{ name: "Location", value: "location" },
				),
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
		const mode = interaction.options.getString("mode");

		// Attempting to capitalise Pokemon names that result in a default egg.
		const isDefaultEgg = pokemonInfo.name === "Egg";
		const capitalizedPokemonName = isDefaultEgg
			? pokemonName
					.toLowerCase()
					.replace(/(?:^|\s|-)\S/g, (char) => char.toUpperCase())
			: pokemonName;

		const targetPokemonInfo = isDefaultEgg
			? getPokemonInfo(getPokemonIdFromDisplayName(capitalizedPokemonName))
			: pokemonInfo;

		const {
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
		} = targetPokemonInfo;

		const imagePrefix = `https://luminescent.team`;
		const imageLnk = `${imagePrefix}${imageSrc}`;

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

		if (mode === "location") {
			// Begin location mode and handle the Magikarp situation.
			if (pokemonName === "Magikarp") {
				const embed = new EmbedBuilder()
					.setTitle(name)
					.setThumbnail(imageLnk)
					.setDescription(
						`Hmm, this Pokemon seems to appear anywhere there is an open body of water. What a successful species! It must be exceedingly strong...`,
					);
				const typeColor = typeColors[type1];
				if (typeColor) {
					embed.setColor(typeColor);
				}
				return interaction.reply({ embeds: [embed] });
			}

			const locations = getEncounterLocations(monsID);

			const embed = new EmbedBuilder().setTitle(name).setThumbnail(imageLnk);
			const typeColor = typeColors[type1];
			if (typeColor) {
				embed.setColor(typeColor);
			}

			if (locations.length === 0) {
				embed.setDescription(
					`Sorry! I couldn't locate that Pokemon as I don't have enough data about it. It might not appear in the wild, or maybe it's just exceedinly rare.`,
				);
			} else {
				const formattedLocations = locations
					.map((location) => {
						const encounters = location.encounters
							.map((encounter) => {
								// Use the reverseEncounterTypeMap to map the internal encounter.type to the desired display name.
								const encounterType =
									reverseEncounterTypeMap[encounter.type] || encounter.type;
								return `${encounterType}\nLevel: ${encounter.level} | Rate: ${encounter.rate}%`;
							})
							.join("\n");
						return `**${location.location}**\n${encounters}`;
					})
					.join("\n\n");
				embed.setDescription(
					`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n${formattedLocations}`,
				);
			}

			return interaction.reply({ embeds: [embed] });
		} else if (mode === "evolution") {
			// Begin evolution mode.
			const embed = new EmbedBuilder()
				.setTitle(name)
				.setDescription(
					`Evolution mode was enabled, but I still haven't learned everything about evolution. Perhaps you can help by filling out your Pokedex!`,
				)
				.setThumbnail(imageLnk);

			const typeColor = typeColors[type1];
			if (typeColor) {
				embed.setColor(typeColor);
			}

			return interaction.reply({ embeds: [embed] });
		} else {
			// Begin general/statistics mode.
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
				femalePercentage = Math.round(
					(femaleValue / totalPossibleValues) * 100,
				);
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

			embed.addFields({
				name: `**Stats:**`,
				value: `Total: ${baseStatsTotal}`,
			});

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
				const hp = targetPokemonInfo.baseStats.hp;
				const atk = targetPokemonInfo.baseStats.atk;
				const def = targetPokemonInfo.baseStats.def;
				const spa = targetPokemonInfo.baseStats.spa;
				const spd = targetPokemonInfo.baseStats.spd;
				const spe = targetPokemonInfo.baseStats.spe;

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

				return interaction.reply({ embeds: [embed], files: [attachment] });
			} else {
				const hp = String(targetPokemonInfo.baseStats.hp).padEnd(3, " ");
				const atk = String(targetPokemonInfo.baseStats.atk).padEnd(3, " ");
				const def = String(targetPokemonInfo.baseStats.def).padEnd(3, " ");
				const spa = String(targetPokemonInfo.baseStats.spa).padEnd(3, " ");
				const spd = String(targetPokemonInfo.baseStats.spd).padEnd(3, " ");
				const spe = String(targetPokemonInfo.baseStats.spe).padEnd(3, " ");

				embed.addFields({
					name: `**Base Stats:**`,
					value: `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${hp}│${atk}│${def}│${spa}│${spd}│${spe}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``,
				});

				return interaction.reply({ embeds: [embed] });
			}
		}
	},
};

const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");
const {
	getPokemonIdFromDisplayName,
	getPokemonInfo,
	getEncounterLocations,
	generateMovesViaLearnset,
	getEvolutionTree,
	getPokemonDisplayName,
	getEvolutionMethodDetail,
} = require("../../../dex/index.js");
const { CanvasRenderService } = require("chartjs-node-canvas");
const { botChannelProd, botChannelDev } = require("../../../config.json");

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

// Rename the encounter types
// prettier-ignore
const reverseEncounterTypeMap = {
	ground_mons: "<:grass:1136228499477246043> Walking",
	swayGrass: "<:pokeradar:1136357617074180116> Radar",
	tairyo: ":tv: Swarm",
	water_mons: ":ocean: Surfing",
	boro_mons: "<:oldrod:1136220484304896001> Old Rod",
	ii_mons: "<:goodrod:1136220559856906400> Good Rod",
	sugoi_mons: "<:superrod:1136220619432792097> Super Rod",
	day: "<:Sun:1157324258519818332> Day",
	night: "<:Moon:1157324256988889221> Night",
	Morning: ":sunrise_over_mountains: Morning",
	"Honey Tree": ":honey_pot: Honey Tree",
	Incense: "<:incense:1136358228356243506> Incense",
	"Daily Trophy Garden": ":trophy: Daily Trophy Garden",
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
			// Begin location mode.
			const locations = getEncounterLocations(monsID);

			const embed = new EmbedBuilder().setTitle(name).setThumbnail(imageLnk);
			const typeColor = typeColors[type1];
			if (typeColor) {
				embed.setColor(typeColor);
			}

			const solaceonRuinsRegex = /^Solaceon Ruins\b.*/;
			const turnbackCaveRegex = /^Turnback Cave\b.*/;

			if (locations.length === 0) {
				if (isValid === 0) {
					embed.setDescription(
						`*This Pokemon is* ***not*** *available in 2.0F.*\n\nSorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
					);
				} else {
					evolutionDetails = getEvolutionTree(monsID);
					if (monsID !== evolutionDetails.pokemonId) {
						const locationsBackup = getEncounterLocations(
							evolutionDetails.pokemonId,
						);
						if (locationsBackup.length === 0) {
							embed.setDescription(
								`Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
							);
						} else {
							const BackupName = getPokemonDisplayName(
								evolutionDetails.pokemonId,
							);

							let slicedLocations = locationsBackup;
							let slicedNote = "";

							let botChannel = [];

							if (process.env.NODE_ENV === "production") {
								botChannel = botChannelProd;
							} else {
								botChannel = botChannelDev;
							}

							// Truncate the response when ran outside of the bot channel.
							if (interaction.channel.id !== botChannel) {
								if (locationsBackup.length > 4) {
									slicedLocations = locationsBackup.slice(0, 3);
									slicedNote =
										"**Note:** Encounters have been truncated. Run this command in the bot channel to see all encounters.";
								}
							}
							const formattedLocations = slicedLocations
								.map((location) => {
									const encounters = location.encounters
										.map((encounter) => {
											// Use the reverseEncounterTypeMap to map the internal encounter.type to the desired display name.
											const encounterType =
												reverseEncounterTypeMap[encounter.type] ||
												encounter.type;
											return `${encounterType}\nLevel: ${encounter.level} | Rate: ${encounter.rate}%`;
										})
										.join("\n");

									// Check if the location title is Solaceon or Turnback and remove all the zones.
									let locationTitle = location.location;
									if (solaceonRuinsRegex.test(locationTitle)) {
										locationTitle = locationTitle.replace(
											solaceonRuinsRegex,
											"Solaceon Ruins",
										);
									} else if (turnbackCaveRegex.test(locationTitle)) {
										locationTitle = locationTitle.replace(
											turnbackCaveRegex,
											"Turnback Cave",
										);
									}

									return `**${locationTitle}**\n${encounters}`;
								})
								.join("\n\n");

							embed.setDescription(
								`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n**${BackupName}** can be found:\n\n${formattedLocations}\n\n${slicedNote}`,
							);
						}
					} else {
						embed.setDescription(
							`Sorry! I couldn't locate that Pokémon as I don't have enough data about it. It might not appear in the wild.`,
						);
					}
				}
			} else {
				let slicedLocations = locations;
				let slicedNote = "";

				let botChannel = [];

				if (process.env.NODE_ENV === "production") {
					botChannel = botChannelProd;
				} else {
					botChannel = botChannelDev;
				}

				// Truncate the response when ran outside of the bot channel.
				if (interaction.channel.id !== botChannel) {
					if (locations.length > 4) {
						slicedLocations = locations.slice(0, 3);
						slicedNote =
							"**Note:** Encounters have been truncated. Run this command in the bot channel to see all encounters.";
					}
				}
				const formattedLocations = slicedLocations
					.map((location) => {
						const encounters = location.encounters
							.map((encounter) => {
								// Use the reverseEncounterTypeMap to map the internal encounter.type to the desired display name.
								const encounterType =
									reverseEncounterTypeMap[encounter.type] || encounter.type;
								return `${encounterType}\nLevel: ${encounter.level} | Rate: ${encounter.rate}%`;
							})
							.join("\n");

						// Check if the location title is Solaceon or Turnback and remove all the zones.
						let locationTitle = location.location;
						if (solaceonRuinsRegex.test(locationTitle)) {
							locationTitle = locationTitle.replace(
								solaceonRuinsRegex,
								"Solaceon Ruins",
							);
						} else if (turnbackCaveRegex.test(locationTitle)) {
							locationTitle = locationTitle.replace(
								turnbackCaveRegex,
								"Turnback Cave",
							);
						}

						return `**${locationTitle}**\n${encounters}`;
					})
					.join("\n\n");

				embed.setDescription(
					`**Encounter information:**\n\nStandard rates assume that incense/radar are not active. For further accuracy, visit [our docs](https://luminescent.team/docs).\n\n${formattedLocations}\n\n${slicedNote}`,
				);
			}
			return interaction.reply({ embeds: [embed] });
		} else if (mode === "evolution") {
			// Begin evolution mode and handle Shedinja.
			if (name === `Shedinja`) {
				const embed = new EmbedBuilder()
					.setTitle(name)
					.setDescription(
						`*Evolves from:*\n**Nincada**\nFree Space + Poké Ball`,
					)
					.setThumbnail(imageLnk);

				const typeColor = typeColors[type1];
				if (typeColor) {
					embed.setColor(typeColor);
				}

				return interaction.reply({ embeds: [embed] });
			}

			evolutionDetails = getEvolutionTree(monsID);

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
					const pattern = new RegExp(
						Object.keys(wordToEmojiMap).join("|"),
						"gi",
					);

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

			let evolutionDescription = getEvolutionDescription(
				evolutionDetails,
				monsID,
			);

			if (isValid === 0) {
				evolutionDescription =
					"*This Pokemon is* ***not*** *available in 2.0F.*\n\n" +
					evolutionDescription;
			}

			const embed = new EmbedBuilder()
				.setTitle(name)
				.setDescription(`${evolutionDescription}`)
				.setThumbnail(imageLnk);

			const typeColor = typeColors[type1];
			if (typeColor) {
				embed.setColor(typeColor);
			}

			return interaction.reply({ embeds: [embed] });
		} else if (mode === "learnset") {
			// Begin learnset mode.
			const embed = new EmbedBuilder().setTitle(name).setThumbnail(imageLnk);

			const typeColor = typeColors[type1];
			if (typeColor) {
				embed.setColor(typeColor);
			}

			let validDesc = "";
			if (isValid === 0) {
				validDesc = `*This Pokemon is* ***not*** *available in 2.0F.*\n\n`;
			}

			try {
				const learnset = generateMovesViaLearnset(monsID, 100);

				const movesetString = learnset
					.map((entry) => {
						const moveTypeIcon = typeIcons[entry.typeName];
						const paddedLevel = entry.level.toString().padEnd(2, "\u00A0");
						return `Level ${paddedLevel} - ${moveTypeIcon} ${entry.moveName}`;
					})
					.join("\n");

				embed.setDescription(`${validDesc}**Learnset**:\n${movesetString}`);

				return interaction.reply({ embeds: [embed] });
			} catch (error) {
				console.error(error);

				// Create a default embed to handle the error situation
				embed.setDescription(
					"That Pokemon seems to learn a move I am unfamiliar with. Perhaps we will get to see such a move one day.",
				);

				return interaction.reply({ embeds: [embed] });
			}
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
				if (isValid === 0) {
					embed.setDescription(
						`*This Pokemon is* ***not*** *available in 2.0F.*\n\n**Type:** ${type1Icon}`,
					);
				} else {
					embed.setDescription(`**Type:** ${type1Icon}`);
				}
			} else {
				const type1Icon = typeIcons[type1];
				const type2Icon = typeIcons[type2];
				if (isValid === 0) {
					embed.setDescription(
						`*This Pokemon is* ***not*** *available in 2.0F.*\n\n**Type:** ${type1Icon} \u200b ${type2Icon}`,
					);
				} else {
					embed.setDescription(`**Type:** ${type1Icon} \u200b ${type2Icon}`);
				}
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
				const hp =
					pokemonInfo.baseStats.hp !== 0
						? pokemonInfo.baseStats.hp
						: BackupInfo.baseStats.hp;
				const atk =
					pokemonInfo.baseStats.atk !== 0
						? pokemonInfo.baseStats.atk
						: BackupInfo.baseStats.atk;
				const def =
					pokemonInfo.baseStats.def !== 0
						? pokemonInfo.baseStats.def
						: BackupInfo.baseStats.def;
				const spa =
					pokemonInfo.baseStats.spa !== 0
						? pokemonInfo.baseStats.spa
						: BackupInfo.baseStats.spa;
				const spd =
					pokemonInfo.baseStats.spd !== 0
						? pokemonInfo.baseStats.spd
						: BackupInfo.baseStats.spd;
				const spe =
					pokemonInfo.baseStats.spe !== 0
						? pokemonInfo.baseStats.spe
						: BackupInfo.baseStats.spe;

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
				const hp = String(
					pokemonInfo.baseStats.hp !== 0
						? pokemonInfo.baseStats.hp
						: BackupInfo.baseStats.hp,
				).padEnd(3, " ");
				const atk = String(
					pokemonInfo.baseStats.atk !== 0
						? pokemonInfo.baseStats.atk
						: BackupInfo.baseStats.atk,
				).padEnd(3, " ");
				const def = String(
					pokemonInfo.baseStats.def !== 0
						? pokemonInfo.baseStats.def
						: BackupInfo.baseStats.def,
				).padEnd(3, " ");
				const spa = String(
					pokemonInfo.baseStats.spa !== 0
						? pokemonInfo.baseStats.spa
						: BackupInfo.baseStats.spa,
				).padEnd(3, " ");
				const spd = String(
					pokemonInfo.baseStats.spd !== 0
						? pokemonInfo.baseStats.spd
						: BackupInfo.baseStats.spd,
				).padEnd(3, " ");
				const spe = String(
					pokemonInfo.baseStats.spe !== 0
						? pokemonInfo.baseStats.spe
						: BackupInfo.baseStats.spe,
				).padEnd(3, " ");

				embed.addFields({
					name: `**Base Stats:**`,
					value: `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${hp}│${atk}│${def}│${spa}│${spd}│${spe}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``,
				});

				return interaction.reply({ embeds: [embed] });
			}
		}
	},
};

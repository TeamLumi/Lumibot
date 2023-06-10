const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getPokemonMonsnoFromName } = require('../../../dex/name.js');
const { getPokemonInfo } = require('../../../dex/index.js');

const typeColors = {
  Grass: '#A3B18A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
  Normal: '#A8A77A',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pokedex')
    .setDescription('Retrieve information about a Pokemon')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('The name of the Pokemon')
        .setRequired(true)),

  execute(interaction) {
    // Here we grab the Pokemon name from the interaction, then convert that to its monsNo so we can parse the pokemon's data with the dex commands.
    const pokemonName = interaction.options.getString('pokemon').toLowerCase();
    const pokemonNameCapital = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    const monsNo = getPokemonMonsnoFromName(pokemonNameCapital);
    const pokemonInfo = getPokemonInfo(monsNo);

    // We log the pokemon's data to individual constants to make it easier to use the EmbedBuilder.

    const ability1 = pokemonInfo.ability1;
    const ability2 = pokemonInfo.ability2;
    const abilityH = pokemonInfo.abilityH;
    const tmLearnset = pokemonInfo.tmLearnset;
    const prettyBaseStats = pokemonInfo.prettyBaseStats;
    const hp = String(pokemonInfo.baseStats.hp).padEnd(3, ' ');
    const atk = String(pokemonInfo.baseStats.atk).padEnd(3, ' ');
    const def = String(pokemonInfo.baseStats.def).padEnd(3, ' ');
    const spa = String(pokemonInfo.baseStats.spa).padEnd(3, ' ');
    const spd = String(pokemonInfo.baseStats.spd).padEnd(3, ' ');
    const spe = String(pokemonInfo.baseStats.spe).padEnd(3, ' ');    
    const baseStatsTotal = pokemonInfo.baseStatsTotal;
    const weight = pokemonInfo.weight;
    const height = pokemonInfo.height;
    const grassKnotPower = pokemonInfo.grassKnotPower;
    const type1 = pokemonInfo.type1;
    const type2 = pokemonInfo.type2;
    const imageSrc = pokemonInfo.imageSrc;
    const imagePrefix = `https://luminescent.team`;
    const imageLnk = `${imagePrefix}${imageSrc}`;
    const genderDecimalValue = pokemonInfo.genderDecimalValue;

    const embed = new EmbedBuilder()
    .setTitle(pokemonNameCapital)
    .setThumbnail(imageLnk)
    .addFields(
      { name: `**Abilties:**`, value: `${ability1} | ${ability2}`, inline: true },
      { name: `**Hidden Ability:**`, value: `${abilityH}`, inline: true },
    )
    .addFields(
      { 
        name: `**Base Stats:**`, 
        value: `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${hp}│${atk}│${def}│${spa}│${spd}│${spe}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``
      },
    )
    .addFields(
      { name: `**Weight:**`, value: `${weight} kg`, inline: true },
      { name: `**Height:**`, value: `${height} m`, inline: true },
    );

    const typeColor = typeColors[type1];
    if (typeColor) {
      embed.setColor(typeColor);
    }

    if (type1 === type2) {
      embed.setDescription(`**Type:** ${type1}`);
    } else {
      embed.setDescription(`**Type:** ${type1} | ${type2}`);
    }

      interaction.reply({ embeds: [embed] });
    }
};
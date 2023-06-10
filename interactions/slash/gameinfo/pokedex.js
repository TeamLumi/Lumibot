const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getPokemonMonsnoFromName } = require('../../../dex/name.js');
const { getPokemonInfo } = require('../../../dex/index.js');

// Array for pokemon types to set colours.
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

// Array for pokemon types to set icons.
const typeIcons = {
  Bug: '<:t_bug:1117062630553702431>',
  Dark:'<:t_dark:1117063037858353162>',
  Dragon: '<:t_dragon:1117062647439949875>',
  Electric: '<:t_electric:1117063036268711957>',
  Fairy: '<:t_fairy:1117062642964635698>',
  Fighting: '<:t_fighting:1117063035224334426>',
  Fire: '<:t_fire:1117063764487962624>',
  Flying: '<:t_flying:1117063032644845680>',
  Ghost: '<:t_ghost:1117062639420452874>',
  Grass: '<:t_grass:1117063031579488370>',
  Ground: '<:t_ground:1117062637566570538>',
  Ice: '<:t_ice:1117062636861927505>',
  Normal: '<:t_normal:1117062635817554010>',
  Poison: '<:t_poison:1117062634219524146>',
  Psychic: '<:t_psychic:1117062633191919657>',
  Rock: '<:t_rock:1117062629282816061>',
  Steel: '<:t_steel:1117062632172683414>',
  Water: '<:t_water:1117063766308298772>',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pokedex')
    .setDescription('Retrieve information about a Pokemon')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('The name of the Pokemon')
        .setRequired(true)
        .setAutocomplete(true)),

  async execute(interaction) {

    // Here we grab the Pokemon name from the interaction and convert it to use proper capitalisation.
    const pokemonName = interaction.options.getString('pokemon').toLowerCase();
    const pokemonNameCapital = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    // Then we convert the name to the Pokemon's monnsNo which we use to get further information.
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
    .setThumbnail(imageLnk);

    if (ability1 === ability2) {
      embed.addFields(
        { name: `**Abilties:**`, value: `${ability1}`, inline: true },
        { name: `**Hidden Ability:**`, value: `${abilityH}`, inline: true },
      )
    } else {
      embed.addFields(
        { name: `**Abilties:**`, value: `${ability1}\n${ability2}`, inline: true },
        { name: `**Hidden Ability:**`, value: `${abilityH}`, inline: true },
      )
    }

    embed.addFields(
      { 
        name: `**Base Stats:**`, 
        value: `\`╔═══╤═══╤═══╤═══╤═══╤═══╗\`\n\`║HP\u00A0│ATK│DEF│SPA│SPD│SPE║\`\n\`╠═══╪═══╪═══╪═══╪═══╪═══╣\`\n\`║${hp}│${atk}│${def}│${spa}│${spd}│${spe}║\`\n\`╚═══╧═══╧═══╧═══╧═══╧═══╝\``
      },
    );
    embed.addFields(
      { name: `**Weight:**`, value: `${weight} kg`, inline: true },
      { name: `**Height:**`, value: `${height} m`, inline: true },
    );

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
      embed.setDescription(`**Type:** ${type1Icon} | ${type2Icon}`);
    }

      interaction.reply({ embeds: [embed] });
    }
};
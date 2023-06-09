const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const pokemonDataPath = path.join(__dirname, '../../../gamedata/input/LumiMons.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pokedex')
    .setDescription('Retrieve information about a Pokemon')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('The name of the Pokemon')
        .setRequired(true)),

  execute(interaction) {
    const pokemonName = interaction.options.getString('pokemon').toLowerCase();
    const pokemonNameCapital = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    fs.readFile(pokemonDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return interaction.reply('An error occurred while retrieving Pokémon data.');
      }

      const pokemonData = JSON.parse(data);

      const pokemon = pokemonData[pokemonNameCapital];

      if (!pokemon) {
        const embed = new EmbedBuilder()
          .setTitle(`Shaymin:`)
          .setDescription(`Oops! No data found for the provided Pokemon. Run '/help pokedex' for more information about how to use this command.`);
        return interaction.reply({ embeds: [embed] });
      }

      const description = 
      `**Types**: ${pokemon.types.join(', ')}\n
      **Base Stats**:\n
      HP: ${pokemon.bs.hp}
      AT: ${pokemon.bs.at}
      DF: ${pokemon.bs.df}
      SA: ${pokemon.bs.sa}
      SD: ${pokemon.bs.sd}
      SP: ${pokemon.bs.sp}\n
      **Weight**: ${pokemon.weightkg} kg\n
      **Abilities**: ${Object.values(pokemon.abilities).join(', ')}`;

      axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => {
        const imageURL = response.data.sprites.front_default;

        const embed = new EmbedBuilder()
        .setTitle(pokemonNameCapital)
        .setDescription(description.trim())
        .setThumbnail(imageURL);

        interaction.reply({ embeds: [embed] });
      })
      .catch(err => {
        console.error(err);
        interaction.reply('An error occurred while retrieving Pokemon data.');
      })

    });
  },
};
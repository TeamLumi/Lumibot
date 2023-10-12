const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
    data: {
        name: ["[pokedex]",
               "[pokédex]",
               "[dex]"],
    },
    execute(message, args) {
      const embed = new EmbedBuilder()
  .setAuthor({
    name: "Team Lumi",
  })
  .setTitle("Pokédex")
  .setURL("https://luminescent.team/pokedex")
  .setDescription("Check out our online Pokédex! Includes movesets, BSTs, types and wild held items. Its information is taken directly from the game files themselves, so everything will be 100% accurate to what is in game, even if the game itself contains errors.\n\nPlease note that it currently does not include Pokémon locations. We ask that you continue to use <#1139732466857418872> in the meanwhile.")
  .setThumbnail("https://cdn.discordapp.com/attachments/1115345759496323173/1115682731884560485/gremlin.png");
      message.channel.send({ embeds: [embed] });
    },
};

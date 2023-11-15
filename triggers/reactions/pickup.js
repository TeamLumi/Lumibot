const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
    data: {
        name: ["[pickup]"],
    },
    execute(message, args) {
      const embed = new EmbedBuilder()
  .setAuthor({
    name: "Team Lumi",
  })
  .setTitle("Pickup Changes")
  .setURL("https://luminescent.team/docs/pickup")
  .setDescription("Luminescent Platinum has adjusted the items you might find with Pickup through the course of the game. We wanted to give the players more useful things as incentive to actually carry that Pokémon around. The ranges for each table match our level caps to better differentiate when each new tier unlocks.\n\nWe recommend using Pokétch App 5 (\"Pokémon List\") to see whenever a Pokémon has suddenly picked up a new item after battle.")
  .setThumbnail("https://media.discordapp.net/attachments/1115345759496323173/1115681769887387748/items.png?width=471&height=494");
      
      message.channel.send({ embeds: [embed] });
    },
};

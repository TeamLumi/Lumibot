const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: [
			"[io]",
			"[imposter's ordeal]",
			"[imposters ordeal]",
			"[randomize]",
			"[randomise]",
			"[randomizer]",
			"[randomiser]",
		],
	},
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setColor(0x9f2b68);

		if (message.content.toLowerCase().includes("[io]"))
			embed
				.setTitle("Imposter's Ordeal")
				.setURL("https://github.com/Nifyr/Imposters-Ordeal/")
				.setThumbnail(
					"https://www.serebii.net/cafemix/pokemon/132-pretendeevee.png",
				)
				.setDescription(
					`Imposter's Ordeal is a BDSP randomizer that also allows you to edit a vast array of game functions. Requires a romfs/exefs extraction of 1.3.0 (BD if you're going to add Lumi, though SP works if you're just messing with vanilla). From there, click "add mod" to load the Luminescent romfs/exefs folders. Once you're finished editing, put the resultant "output" files into the space of your Luminescent mod.\n\nImposter's Ordeal allows you to change move attributes (types, additional effects, accuracy, etc), shop lists, route encounters, and Pokémon statistics such as their typing, BST, and wild held items.\n\nThe **randomizer function** is only compatible with versions 2.0.4+. [Here is our guide](https://www.nexusmods.com/pokemonbdsp/articles/3) on how to do it.\n\nAlways download the **latest version** from the [releases page](https://github.com/Nifyr/Imposters-Ordeal/releases). Requires .NET 5.0.`,
				);
		else if (message.content.toLowerCase().includes("[imposter's ordeal]"))
			embed
				.setTitle("Imposter's Ordeal")
				.setURL("https://github.com/Nifyr/Imposters-Ordeal/")
				.setThumbnail(
					"https://www.serebii.net/cafemix/pokemon/132-pretendeevee.png",
				)
				.setDescription(
					`Imposter's Ordeal is a BDSP randomizer that also allows you to edit a vast array of game functions. Requires a romfs/exefs extraction of 1.3.0 (BD if you're going to add Lumi, though SP works if you're just messing with vanilla). From there, click "add mod" to load the Luminescent romfs/exefs folders. Once you're finished editing, put the resultant "output" files into the space of your Luminescent mod.\n\nImposter's Ordeal allows you to change move attributes (types, additional effects, accuracy, etc), shop lists, route encounters, and Pokémon statistics such as their typing, BST, and wild held items.\n\nThe **randomizer function** is only compatible with versions 2.0.4+. [Here is our guide](https://www.nexusmods.com/pokemonbdsp/articles/3) on how to do it.\n\nAlways download the **latest version** from the [releases page](https://github.com/Nifyr/Imposters-Ordeal/releases). Requires .NET 5.0.`,
				);
		else if (message.content.toLowerCase().includes("[imposters ordeal]"))
			embed
				.setTitle("Imposter's Ordeal")
				.setURL("https://github.com/Nifyr/Imposters-Ordeal/")
				.setThumbnail(
					"https://www.serebii.net/cafemix/pokemon/132-pretendeevee.png",
				)
				.setDescription(
					`Imposter's Ordeal is a BDSP randomizer that also allows you to edit a vast array of game functions. Requires a romfs/exefs extraction of 1.3.0 (BD if you're going to add Lumi, though SP works if you're just messing with vanilla). From there, click "add mod" to load the Luminescent romfs/exefs folders. Once you're finished editing, put the resultant "output" files into the space of your Luminescent mod.\n\nImposter's Ordeal allows you to change move attributes (types, additional effects, accuracy, etc), shop lists, route encounters, and Pokémon statistics such as their typing, BST, and wild held items.\n\nThe **randomizer function** is only compatible with versions 2.0.4+. [Here is our guide](https://www.nexusmods.com/pokemonbdsp/articles/3) on how to do it.\n\nAlways download the **latest version** from the [releases page](https://github.com/Nifyr/Imposters-Ordeal/releases). Requires .NET 5.0.`,
				);
		else
			embed
				.setTitle("How to Randomize Lumi")
				.setURL("https://www.nexusmods.com/pokemonbdsp/articles/3")
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/915474449657126932/1105083844073369621/randomize_.png",
				)
				.setDescription(
					"Check this page out for instructions and necessary links involved for randomizing Pokémon Luminescent Platinum!\n\nPlease note that changing the starter selection is not possible due to the bizarro fact that those are hard-coded, and any hard-coding changes will break Lumi.",
				);

		message.channel.send({ embeds: [embed] });
	},
};

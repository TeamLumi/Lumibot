// Deconstructing prefix from config file to use in help command
const { prefix } = require("./../../config.json");

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
	data: {
		name: "help",
		description: "List all commands of bot or info about a specific command.",
		aliases: ["commands"],
		usage: "[command name]",
		cooldown: 5,
		},

	execute(message, args) {
		const { commands } = message.client;

		// If there are no args, it means it needs whole help command.

		if (!args.length) {
			/**
			 * @type {EmbedBuilder}
			 * @description Help command embed object
			 */

			let helpEmbed = new EmbedBuilder()
				.setColor("Random")
				.setTitle("List of all my commands")
				.setDescription(
					"`" + commands.map((command) => command.name).join("`, `") + "`"
				)

				.addFields([
					{
						name: "Usage",
						value: `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`,
					},
				]);

			// Attempts to send embed in DMs.

			return message.author
				.send({ embeds: [helpEmbed] })

				.then(() => {
					if (message.channel.type === ChannelType.DM) return;

					// On validation, reply back.

					message.reply({
						content: "I've sent you a DM with all my commands!",
					});
				})
				.catch((error) => {
					// On failing, throw error.

					console.error(
						`Could not send help DM to ${message.author.tag}.\n`,
						error
					);

					message.reply({ content: "It seems like I can't DM you!" });
				});
		}

		const name = args[0].toLowerCase();

		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		// If it's an invalid command.

		if (!command) {
			return message.reply({ content: "That's not a valid command!" });
		}

		// Create embed
		let commandEmbed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("Command Help");

		if (command.description)
			commandEmbed.setDescription(`${command.description}`);

		if (command.aliases)
			commandEmbed.addFields([
				{
					name: "Aliases",
					value: `\`${command.aliases.join(", ")}\``,
					inline: true,
				},
				{
					name: "Cooldown",
					value: `${command.cooldown || 3} second(s)`,
					inline: true,
				},
			]);
		if (command.usage)
			commandEmbed.addFields([
				{
					name: "Usage",
					value: `\`${prefix}${command.name} ${command.usage}\``,
					inline: true,
				},
			]);

		// Finally send the embed.

		message.channel.send({ embeds: [commandEmbed] });
	},
};

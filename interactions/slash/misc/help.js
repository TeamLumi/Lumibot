const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands of bot or info about a specific command.",
		)
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("The specific command to see the info of.")
				.setRequired(false)
				.setAutocomplete(true),
		),

	async execute(interaction) {
		let name = interaction.options.getString("command");

		const helpEmbed = new EmbedBuilder().setColor("Random");

		if (name) {
			name = name.toLowerCase();

			// If a single command has been asked for, send only this command's help.

			if (interaction.client.slashCommands.has(name)) {
				helpEmbed.setTitle(`Help for \`${name}\` command`);

				const command = interaction.client.slashCommands.get(name);

				if (command.data.description) {
					helpEmbed.setDescription(
						command.data.description + "\n\n**Parameters:**",
					);
					// Loop through each parameter of the command and add it to the embed.
					if (command.data.options && command.data.options.length > 0) {
						for (const option of command.data.options) {
							helpEmbed.addFields({
								name: option.name,
								value: option.description,
							});
						}
					} else {
						helpEmbed.addFields({
							name: "None",
							value: "This command doesn't have any parameters.",
						});
					}
				}
			} else {
				const attachment = new AttachmentBuilder(
					"./assets/shaymin_paradox_error.png",
				);

				helpEmbed
					.setTitle(`Oops!`)
					.setDescription(
						`I couldn't find a command by that name\nin our system, so I can't help you with it.\nSorry!`,
					)
					.setThumbnail("attachment://shaymin_paradox_error.png")
					.setColor(0x2664ea);

				return interaction.reply({ embeds: [helpEmbed], files: [attachment] });
			}
		} else {
			// Give a list of all the commands

			helpEmbed.setTitle("List of all my slash commands").setDescription(
				"`" +
					interaction.client.slashCommands
						.filter((command) => !shouldExcludeCommand(command))
						.map((command) => command.data.name)
						.join("`, `") +
					"`",
			);
		}

		// Replies to the interaction!

		await interaction.reply({
			embeds: [helpEmbed],
		});
	},
};

function shouldExcludeCommand(command) {
	return command.data.name === "amicute";
}

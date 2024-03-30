const {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

// Calculated from https://discordapi.com/permissions.html
const permissionName = {
	2: "Kick Members",
	4: "Ban Members",
	8: "Moderator",
	4194304: "Mute Members",
};

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("List all commands of bot or info about a specific command.")
		.addStringOption(option =>
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
			if (name === "tags") {
				helpEmbed.setTitle(`List of all my tags`).setDescription(
					"`" +
						interaction.client.triggers
							.filter(command => !shouldExcludeCommand(command))
							.map(command => command.data.name)
							.join("`, `") +
						"`",
				);
			} else if (interaction.client.slashCommands.has(name)) {
				helpEmbed.setTitle(`Help for \`${name}\` command`);
				const command = interaction.client.slashCommands.get(name);

				// Check if the command has required permissions and filter users who don't have permission.
				if (command.data.default_member_permissions) {
					const requiredPermissions = command.data.default_member_permissions;
					const permissionDisplay = permissionName[requiredPermissions];

					if (!interaction.member.permissions.has(requiredPermissions)) {
						helpEmbed
							.setDescription(`You don't have permission to use this command.`)
							.setFooter({
								text: `Required permissions: ${permissionDisplay}`,
							});

						return interaction.reply({
							embeds: [helpEmbed],
							ephemeral: true,
						});
					}
					helpEmbed.setFooter({
						text: `Required permissions: ${permissionDisplay}`,
					});
				}

				if (command.data.description) {
					helpEmbed.setDescription(command.data.description + "\n\n**Parameters:**");

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
			// Give a list of all the commands.
			helpEmbed.setTitle("List of all my slash commands").setDescription(
				"`" +
					interaction.client.slashCommands
						.filter(command => !shouldExcludeCommand(command))
						.filter(command => {
							// Check if the command has specific member permissions defined and filter out.
							const requiredPermissions = command.data.default_member_permissions;
							if (requiredPermissions)
								return interaction.member.permissions.has(requiredPermissions);
							return true;
						})
						.map(command => command.data.name)
						.join("`, `") +
					"`",
			);
		}
		await interaction.reply({
			embeds: [helpEmbed],
		});
	},
};

function shouldExcludeCommand(command) {
	return (
		command.data.name === "amicute" || command.data.name === "someOtherCommand"
	);
}

const {
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Super Mod Command: Reloads a command.")
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("The name of the command to be reloaded")
				.setRequired(true)
				.setAutocomplete(true),
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.setDMPermission(false),

	async execute(interaction) {
		const { client } = interaction;
		const commandName = interaction.options.getString("command");
		const command = client.slashCommands.get(commandName);

		if (command) {
			// Reload the specified command.

			const slashCommandsFolderPath = path.join(
				__dirname,
				"..",
				"..",
				"..",
				"interactions",
				"slash",
			);

			const slashCommands = fs.readdirSync(slashCommandsFolderPath);

			const folderName = slashCommands.find((folder) =>
				fs
					.readdirSync(path.join(slashCommandsFolderPath, folder))
					.includes(`${commandName}.js`),
			);

			const filePath = path.join(
				slashCommandsFolderPath,
				folderName,
				`${commandName}.js`,
			);

			delete require.cache[require.resolve(filePath)];

			try {
				const newCommand = require(filePath);

				// Remove old command and set the new one.
				client.slashCommands.delete(commandName);
				client.slashCommands.set(newCommand.data.name, newCommand);

				return interaction.reply({
					content: `Command \`${newCommand.data.name}\` was reloaded!`,
					ephemeral: true,
				});
			} catch (error) {
				console.error(error);
				return interaction.reply({
					content: `There was an error while reloading command \`${commandName}\``,
					ephemeral: true,
				});
			}
		} else if (commandName === "triggers") {
			// Reload all triggers

			const triggersFolderPath = path.join(
				__dirname,
				"..",
				"..",
				"..",
				"triggers",
			);

			const triggerFolders = fs
				.readdirSync(triggersFolderPath, { withFileTypes: true })
				.filter((item) => item.isDirectory())
				.map((item) => item.name);

			client.triggers.clear();

			for (const folder of triggerFolders) {
				const triggersPath = path.join(triggersFolderPath, folder);
				const triggerFiles = fs
					.readdirSync(triggersPath)
					.filter((file) => file.endsWith(".js"));

				for (const file of triggerFiles) {
					const filePath = path.join(triggersPath, file);
					delete require.cache[require.resolve(filePath)];

					try {
						const trigger = require(filePath);
						if ("data" in trigger && "execute" in trigger) {
							client.triggers.set(trigger.data.name, trigger);
						} else {
							console.log(
								`[WARNING] The trigger at ${filePath} is missing a required "data" or "execute" property.`,
							);
						}
					} catch (error) {
						console.error(error);
					}
				}
			}
			return interaction.reply({
				content: `All triggers have been reloaded!`,
				ephemeral: true,
			});
		} else {
			return interaction.reply({
				content: `There is no command with name or alias \`${commandName}\``,
				ephemeral: true,
			});
		}
	},
};

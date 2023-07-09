/*
 * Hey Zatsu here. If you are reading this, welcome to the Lumi Discord Bot.
 * This was built from an Open Source boilerplate made by https://github.com/NamVr
 * This file probably shouldnt be edited, as you can create your own commands
 * in the /commands folder.
 *
 * You can also set triggers in the /triggers folder. So that the bot will react
 * to certain words without the need of slash commands.
 * Though I try to keep the bot to only reading commands in square brackets [].
 *
 * I've given template.js files in each of those directories for you to copy from
 * in order to create your own commands using this structure.
 */

// Initialise dependencies.

const fs = require("fs");
const path = require("node:path");
const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, client_id, test_guild_id } = require("./config.json");

// Create a new client instance.

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

// initialises the event handling files.

const eventFolderPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventFolderPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventFolderPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client),
		);
	}
}

// Define Collection of Commands, Slash Commands and cooldowns

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();
client.triggers = new Collection();

// Registration of Message-Based Legacy Commands.

const commandFolderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFolderPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandFolderPath, folder);
	const commandFiles = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

// Registration of Slash-Command Interactions.

const slashCommandsFolderPath = path.join(__dirname, "interactions", "slash");
const slashCommands = fs.readdirSync(slashCommandsFolderPath);

for (const module of slashCommands) {
	const modulePath = path.join(slashCommandsFolderPath, module);
	const commandFiles = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const filePath = path.join(modulePath, commandFile);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.slashCommands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] the slash-command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

// Registration of Autocomplete Interactions.

const autocompleteFolderPath = path.join(
	__dirname,
	"interactions",
	"autocomplete",
);
const autocompleteInteractions = fs.readdirSync(autocompleteFolderPath);

for (const module of autocompleteInteractions) {
	const modulePath = path.join(autocompleteFolderPath, module);
	const files = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith(".js"));

	for (const interactionFile of files) {
		const filePath = path.join(modulePath, interactionFile);
		const interaction = require(filePath);
		if ("execute" in interaction) {
			client.autocompleteInteractions.set(interaction.name, interaction);
		} else {
			console.log(
				`[WARNING] the autocomplete interaction at ${filePath} is missing a required "execute" property.`,
			);
		}
	}
}

// Registration of Context-Menu Interactions.

const contextMenusFolderPath = path.join(
	__dirname,
	"interactions",
	"context-menus",
);
const contextMenus = fs.readdirSync(contextMenusFolderPath);

for (const folder of contextMenus) {
	const folderPath = path.join(contextMenusFolderPath, folder);
	const files = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of files) {
		const filePath = path.join(folderPath, file);
		const menu = require(filePath);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

// Registration of Button-Command Interactions.

const buttonCommandsFolderPath = path.join(
	__dirname,
	"interactions",
	"buttons",
);
const buttonCommands = fs.readdirSync(buttonCommandsFolderPath);

for (const module of buttonCommands) {
	const modulePath = path.join(buttonCommandsFolderPath, module);
	const commandFiles = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const filePath = path.join(modulePath, commandFile);
		const command = require(filePath);
		client.buttonCommands.set(command.id, command);
	}
}

// Registration of Modal-Command Interactions.

const modalCommandsFolderPath = path.join(__dirname, "interactions", "modals");
const modalCommands = fs.readdirSync(modalCommandsFolderPath);

for (const module of modalCommands) {
	const modulePath = path.join(modalCommandsFolderPath, module);
	const commandFiles = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const filePath = path.join(modulePath, commandFile);
		const command = require(filePath);
		client.modalCommands.set(command.id, command);
	}
}

// Registration of select-menus Interactions.

const selectMenusFolderPath = path.join(
	__dirname,
	"interactions",
	"select-menus",
);
const selectMenus = fs.readdirSync(selectMenusFolderPath);

for (const module of selectMenus) {
	const modulePath = path.join(selectMenusFolderPath, module);
	const commandFiles = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const filePath = path.join(modulePath, commandFile);
		const command = require(filePath);
		client.selectCommands.set(command.id, command);
	}
}

// Registration of Slash-Commands in Discord API

const rest = new REST({ version: "9" }).setToken(token);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			/*
			 * The code below causes the bot to run in development mode.
			 * This means it only deploys guild commands in the development server.
			 * Please comment the below (uncommented) line (for guild commands).
			 * You will also need to uncomment the (commented) line below.
			 */

			Routes.applicationGuildCommands(client_id, test_guild_id),

			/*
			 * Please uncomment the below (commented) line to deploy global commands.
			 * Global command only need to be executed once to update to the Discord API.
			 * Though they do require some time to replicate.
			 * Please comment it again after running the bot once to ensure they don't get re-deployed.
			 */

			//Routes.applicationCommands(client_id),

			{ body: commandJsonData },
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();

/*
 All registration snippets should be changed to use node:path like the code for Triggers below.
 */

// Registration of Message Based Chat Triggers

const triggersFolderPath = path.join(__dirname, "triggers");
const triggerFolders = fs.readdirSync(triggersFolderPath);

// Loop through all files and store triggers in triggers collection.

for (const folder of triggerFolders) {
	const triggersPath = path.join(triggersFolderPath, folder);
	const triggerFiles = fs
		.readdirSync(triggersPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of triggerFiles) {
		const filePath = path.join(triggersPath, file);
		const trigger = require(filePath);
		if ("data" in trigger && "execute" in trigger) {
			client.triggers.set(trigger.data.name, trigger);
		} else {
			console.log(
				`[WARNING] the reaction at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

client.login(token);

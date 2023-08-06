const { REST, Routes } = require("discord.js");
const { token, client_id, test_guild_id } = require("./config.json");

const rest = new REST({ version: "9" }).setToken(token);

// for guild-based commands
rest
	.put(Routes.applicationGuildCommands(client_id, test_guild_id), { body: [] })
	.then(() => console.log("Successfully deleted all guild commands."))
	.catch(console.error);

// for global commands
rest
	.put(Routes.applicationCommands(client_id), { body: [] })
	.then(() => console.log("Successfully deleted all application commands."))
	.catch(console.error);

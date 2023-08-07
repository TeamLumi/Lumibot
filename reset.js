const { REST, Routes } = require("discord.js");
const {
	token_dev,
	token_prod,
	client_id_dev,
	client_id_prod,
	test_guild_id,
} = require("./config.json");

let token = [];
let client_id = [];

if (process.env.NODE_ENV === "production") {
	console.log("Running in production mode");
	token = token_prod;
	client_id = client_id_prod;
} else {
	console.log("Running in development mode");
	token = token_dev;
	client_id = client_id_dev;
}

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

const { prefix } = require("../config.json");

module.exports = {
	/**
	 * @description Executes when the bot is pinged.
	 * @param {import('discord.js').Message} message The Message Object of the command.
	 */
	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! How can I help you? If you need to see more info about my commands, you can use \`/Help\`.`,
		);
	},
};

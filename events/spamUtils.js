const { GuildConfig } = require("../keys.js");

// Function that determines whether a message is spam or not.
async function containsSpam(message) {
	const { guild, content, member } = message;

	try {
		// Query the GuildConfig collection for the guild ID with caching
		const guildConfig = await GuildConfig.findOne({ guildId: guild.id })
			.cache("1 hour")
			.exec();

		if (!guildConfig) {
			return false;
		}

		for (const role of guildConfig.whitelistedRoles) {
			if (member.roles.cache.has(role)) {
				return false;
			}
		}

		for (const phrase of guildConfig.blacklistedPhrases) {
			if (content.includes(phrase)) {
				return true;
			}
		}

		return false;
	} catch (error) {
		console.error(`Error fetching guild config:`, error);
		return false;
	}
}

module.exports = { containsSpam };

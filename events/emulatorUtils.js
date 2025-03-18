const { GuildConfig } = require("../keys.js");
const {
	PermissionsBitField,
} = require("discord.js");

async function containsEmulator(message) {
	const { guild, content, member } = message;

	try {
		// Query the GuildConfig collection for the guild ID with caching
		const guildConfig = await GuildConfig.findOne({ guildId: guild.id })
			.cache?.("1 hour")
			.exec?.();

		if (!guildConfig) {
			return false;
		}

		if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            console.log(`user has permissions:`, member.id);
			return false;
		}

		for (const phrase of guildConfig.unsupportedEmulators) {
			if (content.includes(phrase)) {
                console.log(`user said the thing:`, member.id);
				return true;
			}
		}

		return false;
	} catch (error) {
		console.error(`Error fetching guild config:`, error);
		return false;
	}
}

async function handleEmulator(message) {
    message.reply({ 
        content: `Your message was deleted due to it containing the name of an emulator for Nintendo Switch.\n\nAt this time we are not providing support for any particular emulator due to legal action from Nintendo. You can still reference our [legacy emulator installation](https://luminescent.team/docs/installation/ryujinx) guide but we cannot offer any support or recommendations beyond that at this time.`,
        ephemeral: true, 
    });
    try {
        await message.delete();
    } catch (error) {
        console.error("Failed to delete message:", error);
    }
}

module.exports = { containsEmulator, handleEmulator };
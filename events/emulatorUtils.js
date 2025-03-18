const { GuildConfig } = require("../keys.js");
const {
	PermissionsBitField,
    EmbedBuilder,
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
			return false;
		}

		for (const phrase of guildConfig.unsupportedEmulators) {
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

async function handleEmulator(message) {
    try {
        const embed = new EmbedBuilder()
            .setTitle(`Oops!`)
            .setDescription(
                `Your message was deleted due to it containing the name of an emulator for Nintendo Switch.\n\nAt this time we are not providing support for any emulators due to legal action from Nintendo. You can still reference our [legacy emulator installation](https://luminescent.team/docs/installation/ryujinx) guide but we cannot offer any support or recommendations beyond that currently.`,
            )
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/995539661084696626/1116076538480308244/shaymin_paradox_error.png",
            )
            .setColor(0x2664ea);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
         });
    } catch (error) {
        console.error("Failed to send response:", error);
    }
    try {
        await message.delete();
    } catch (error) {
        console.error("Failed to delete message:", error);
    }
}

module.exports = { containsEmulator, handleEmulator };
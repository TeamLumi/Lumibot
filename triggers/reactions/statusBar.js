const {
	EmbedBuilder,
	PermissionsBitField,
	AttachmentBuilder,
} = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[status bar]", "[status]"],
	},
	execute(message, args) {
		if (
			!message.member.permissions.has(PermissionsBitField.Flags.KickMembers) &&
			!message.member.roles.cache.has('1198760768494129212')
		) {
			return;
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setImage(
				"https://media.discordapp.net/attachments/1032914152257228820/1214356178939936859/image.png",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	data: {
		name: ["[ips]"],
	},
	execute(message, args) {
		if (
			!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return;
		}

		const embed = new EmbedBuilder()
			.setImage(
				"https://luminescent.team/assets/images/exefs_install-502e47bd652324cf9cd505eb2c2a39fd.png",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

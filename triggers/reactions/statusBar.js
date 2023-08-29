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
			!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return;
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Team Lumi",
			})
			.setImage(
				"https://raw.githubusercontent.com/TeamLumi/luminescent-team/main/static/img/yuzuryu.png",
			)
			.setColor(0x000000);

		message.channel.send({ embeds: [embed] });
	},
};

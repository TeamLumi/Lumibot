const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	data: {
		name: "kick",
		description: "Kicks a user. Can only be used by a moderator.",
		usage: "[command name]",
		cooldown: 5,
	},

	async execute(message, args) {
		if (
			!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
		) {
			return;
		}

		if (!args[0]) {
			return message.reply({
				content: `You need to specify a member, like so: !kick @user reason`,
				ephemeral: true,
			});
		}

		let member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(x) =>
					x.user.username.toLowerCase() === args.slice(0).join(" ") ||
					x.user.username === args[0],
			);

		if (!member) {
			return message.reply({
				content: `Sorry! I couldn't find that member.`,
				ephemeral: true,
			});
		}

		if (member.id == "1115351318740095058") {
			return message.reply({
				content: `I can't kick myself!`,
				ephemeral: true,
			});
		}

		if (
			message.member.roles.highest.comparePositionTo(
				message.mentions.members.first().roles.highest,
			) < 1
		) {
			return message.reply({
				content: `My permissions are less than the user you are trying to kick.`,
				ephemeral: true,
			});
		}

		if (message.member.id === member.id) {
			return message.reply({
				content: `I can't kick you.`,
				ephemeral: true,
			});
		}

		if (message.mentions.roles) {
			return;
		}

		var args2 = args.slice(1).join(" ");
		if (!args2) {
			var args2 = `No reason provided.`;
		}

		try {
			await member.kick({
				reason: `${args2}`,
			});
			const embed = new EmbedBuilder()
				.setTitle(`Member Kicked`)
				.setDescription(`> ${member} just got kicked. For reason: ${args2}`)
				.setColor("#00ff00")
				.setFooter(`Requested by ${message.author.username}`)
				.setTimestamp();

			message.channel.send({
				embeds: [embed],
			});
		} catch (error) {
			console.error(`Failed to kick member:`, error);
			message.reply({
				content: `Failed to kick the member. I may not have permission to kick users.`,
				ephemeral: true,
			});
		}
	},
};

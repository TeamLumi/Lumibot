const { GuildConfig } = require("../keys.js");

const spamTracker = new Map();

const SPAM_THRESHOLD = 2; // Number of spam messages triggering kick.
const SPAM_TIMEFRAME = 60000; // Timeframe in milliseconds.

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

async function handleSpam(message) {
	const userId = message.author.id;
	const user = message.author;
	const member = message.member;
	const currentTime = Date.now();

	if (spamTracker.has(userId)) {
		const { count, timestamp } = spamTracker.get(userId);

		// Second instance of spam within the timeframe
		if (count >= SPAM_THRESHOLD && currentTime - timestamp < SPAM_TIMEFRAME) {
			try {
				await user.send({
					content: `Hi! Your account appears to have been compromised/hacked. You may have clicked a scam link, downloaded suspicious software, or scanned a QR code which gave a hacker access to your account. Your account was spamming our community with infectious links and we had no other choice than to remove you from the Team Luminescent server until your account is secure again.\n\n# Please do the following:\n1. Go to :wrench: Settings -> Devices and sign out from any suspicious location you do not recognize.\n2. Change your password. This will reset your user token.\n3. Go to Authorized Apps and remove any app which has the function "Join Servers For You".\n4. Make sure your email address was not changed to one you do not recognize.\n5. If you can, secure your account with 2FA. This can be done via the My Account setting. You would need a PC & mobile device for this. You'll need an Authenticator app like Google Authenticator or Authy. MAKE A BACKUP OF YOUR BACKUP CODES in case you lose your phone or access to the Authenticator.\n\nOnce you have secured your account, you are free to join back!`,
				});
				await member.ban({
					deleteMessageSeconds: "86400",
					reason: "Repeated spamming",
				});

				await message.guild.members.unban(user);
			} catch (error) {
				console.error("Failed to kick user:", error);
			}
			spamTracker.delete(userId);
			return;
		}
	}

	// First instance of spam within the timeframe
	try {
		await message.delete();
	} catch (error) {
		console.error("Failed to delete message:", error);
	}
	spamTracker.set(userId, {
		count: (spamTracker.get(userId)?.count || 0) + 1,
		timestamp: currentTime,
	});
}

module.exports = { containsSpam, handleSpam };

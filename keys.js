const mongoose = require("mongoose");

const guildConfigSchema = new mongoose.Schema({
	guildId: { type: String, required: true, unique: true },
	whitelistedRoles: { type: [String], default: [] },
	blacklistedPhrases: { type: [String], default: [] },
});

const GuildConfig = mongoose.model("GuildConfig", guildConfigSchema);
module.exports = { GuildConfig };

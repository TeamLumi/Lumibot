const mongoose = require("mongoose");

class InMemoryDB {
    constructor() {
        this.data = new Map();
    }

    async findOne(query) {
        return [...this.data.values()].find((doc) => doc.guildId === query.guildId) || null;
    }

    async save(doc) {
        this.data.set(doc.guildId, doc);
        return doc;
    }

    async updateOne(query, update) {
        const existing = await this.findOne(query);
        if (existing) {
            Object.assign(existing, update);
            this.data.set(existing.guildId, existing);
        }
    }

    async deleteOne(query) {
        this.data.delete(query.guildId);
    }
}

let GuildConfig;

if (process.env.NODE_ENV === "production") {
    const guildConfigSchema = new mongoose.Schema({
        guildId: { type: String, required: true, unique: true },
        whitelistedRoles: { type: [String], default: [] },
        blacklistedPhrases: { type: [String], default: [] },
        unsupportedEmulators: { type: [String], default: [] },
    });

    GuildConfig = mongoose.model("GuildConfig", guildConfigSchema);
} else {
    console.log("Using in-memory DB");
    GuildConfig = new InMemoryDB();
}

module.exports = { GuildConfig };

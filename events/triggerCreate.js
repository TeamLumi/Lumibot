module.exports = {
	name: "messageCreate",

	async execute(message) {
		const args = message.content.split(/ +/);
		if (message.author.bot) return;
		let triggered = false;

		for (const trigger of message.client.triggers.values()) {
			if (triggered) break;

			for (const name of trigger.data.name) {
				if (triggered) break;

				if (message.content.toLowerCase().includes(name)) {
					try {
						await trigger.execute(message, args);
					} catch (error) {
						console.error(error);
						message.reply({
							content: "There was an error trying to execute that trigger!",
						});
					}
					triggered = true;
					break;
				}
			}
		}
	},
};

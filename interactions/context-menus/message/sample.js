module.exports = {
	data: {
		name: "sample",
		type: 3,
	},

	async execute(interaction) {
		await interaction.reply({
			content: "I am a sample message context menu.",
		});
		return;
	},
};

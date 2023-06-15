module.exports = {
	data: {
		name: "sample",
		type: 2,
	},

	async execute(interaction) {
		await interaction.reply({
			content: "I am a sample user context menu.",
		});
		return;
	},
};

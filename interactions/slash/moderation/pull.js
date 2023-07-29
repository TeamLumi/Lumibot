const {
	AttachmentBuilder,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} = require("discord.js");
const simpleGit = require("simple-git");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("pull")
		.setDescription("Super Mod Command: Pulls the remote repo to the bot.")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.setDMPermission(false),

	async execute(interaction) {
		// Check if there are pending changes in the local repository
		const git = simpleGit();
		const statusSummary = await git.status();

		if (statusSummary.files.length > 0) {
			await interaction.reply({
				content: `Cannot pull changes because there are pending changes in the local repository.\nTell my creator to stop tinkering with my code on the local repo.`,
				ephemeral: true,
			});
		} else {
			try {
				await git.pull();
				await interaction.reply({
					content: `Successfully pulled changes from the remote repository. Thanks for the update!`,
					ephemeral: true,
				});
			} catch (error) {
				console.log(error);
				await interaction.reply({
					content: `Sorry! Failed to pull changes from the remote repo. See the logs for more info.`,
					ephemeral: true,
				});
			}
		}
	},
};

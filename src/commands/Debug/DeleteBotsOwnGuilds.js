const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletebotsownguilds')
		.setDescription('Deletes all guilds that the bot is the only member of.'),

	async execute(interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });
			const deletedGuilds = [];
			const botGuilds = Array.from(interaction.client.guilds.cache.values());
			for (const guild of botGuilds) {
				if (guild.members.cache.size === 1 && guild.members.cache.first().user.bot) {
					await guild.delete();
					deletedGuilds.push(guild.name);
				}
			}

			await interaction.followUp({ content: `Deleted ${deletedGuilds.length} guild(s): ${deletedGuilds.join(', ')}`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};

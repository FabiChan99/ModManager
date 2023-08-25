const logger = require('../handlers/loggingHandler');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.cmd.get(`${interaction.commandName}`);
		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
			logger.info(`Executed Command: ${interaction.commandName}`);
		}
		catch (error) {
			logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
			else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
	},
};

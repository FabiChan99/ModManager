const { REST, Routes } = require('discord.js');
const path = require('path');
const logger = require(path.join(__dirname, 'loggingHandler'));


class ApiCommandManager {
	constructor(clientId, guildId, token) {
		this.clientId = clientId;
		this.guildId = guildId;
		this.token = token;

		this.rest = new REST({ version: '10' }).setToken(this.token);
	}

	async registerCommands(client) {
		try {
			logger.info('Started refreshing application (/) commands.');
			await this.rest.put(
				// eslint-disable-next-line no-undef
				Routes.applicationGuildCommands((this.clientId), this.guildId),
				{ body: client.commands },
			);

			logger.info('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			logger.error(error);
		}
	}
}

module.exports = ApiCommandManager;

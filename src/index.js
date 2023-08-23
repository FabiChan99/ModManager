const logger = require('./handlers/loggingHandler');
logger.info('Starting DisGuildDefender');

const path = require('path');
const { IntentsBitField } = require('discord.js');
const Discord = require('discord.js');
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require('./handlers/loadEvents');
const config = require('./config.js');
const ApiCommandManager = require('./handlers/ApiCommandManager');


logger.debug('Setting Gatewayintents');
const Intents = new IntentsBitField();
Intents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent);

logger.debug('Constructing Client');
const client = new Discord.Client({ intents: Intents });


client.commands = [];
client.cmd = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');


loadCommands(commandsPath, client);
logger.info('Completely finished command loading!');

loadEvents(eventsPath, client);

const CommandManager = new ApiCommandManager(config.clientID, config.ManagedGuildID, config.BotToken);
(async () => {
	await CommandManager.registerCommands(client);
})();

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.cmd.get(`${interaction.commandName}`);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


logger.info('Login in to the Discord Gateway...');
client.login(config.BotToken);
logger.info('Bot is ready!');
const logger = require('./handlers/loggingHandler');
const packagejson = require('../package.json');
logger.info('Starting DisGuildDefender ' + packagejson.version);

const path = require('path');
const { IntentsBitField } = require('discord.js');
const Discord = require('discord.js');
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require('./handlers/loadEvents');
const config = require('./config.js');
const ApiCommandManager = require('./handlers/ApiCommandManager');
const DbManager = require('./handlers/Database/DatabaseManager');

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


logger.info('Login in to the Discord Gateway...');
client.login(config.BotToken);

const db = new DbManager();

(async () => {
	await db.authenticate();

	await new Promise(resolve => setTimeout(resolve, 1000));

	if (!db.isConnected) {
		logger.error('No connection to database. Shutting down.');
		process.exit(1);
	}
})();

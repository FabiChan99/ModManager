const logger = require('./handlers/loggingHandler');
const packagejson = require('../package.json');
logger.info('Starting ModManager ' + packagejson.version);

const path = require('path');
const { IntentsBitField } = require('discord.js');
const Discord = require('discord.js');
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require('./handlers/loadEvents');
const config = require('./config.js');
const ApiCommandManager = require('./handlers/ApiCommandManager');
const db = require('./handlers/Database/DatabaseManager');
const syncDatabase = require('./handlers/Database/syncDatabase');

logger.debug('Setting Gatewayintents');
const Intents = new IntentsBitField();
Intents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.Guilds);

logger.debug('Constructing Client');
const client = new Discord.Client({ intents: Intents });

client.commands = [];
client.cmd = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');


(async () => {
	loadCommands(commandsPath, client);
	logger.info('Completely finished command loading!');

	loadEvents(eventsPath, client);

	const CommandManager = new ApiCommandManager(config.clientID, config.ManagedGuildID, config.BotToken);
	await CommandManager.registerCommands(client);

	logger.info('Login in to the Discord Gateway...');
	await client.login(config.BotToken);

	await db.authenticate();

	if (!db.isConnected) {
		logger.error('No connection to database. Shutting down.');
		process.exit(1);
	}

	await syncDatabase();
})();
module.exports = client;
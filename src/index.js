const logger = require('./handlers/loggingHandler');
logger.info('Starting DisGuildDefender');

const path = require('path');
const { IntentsBitField } = require('discord.js');
const Discord = require('discord.js');
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require('./handlers/loadEvents');
const config = require('./config.json');


logger.debug('Setting Gatewayintents');
const Intents = new IntentsBitField();
Intents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent);

logger.debug('Constructing Client');
const client = new Discord.Client({ intents: Intents });


client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

loadCommands(commandsPath, client);
loadEvents(eventsPath, client);


logger.info('Login in to the Discord Gateway...');
client.login(config.BotToken.toString());
logger.info('Bot is ready!');
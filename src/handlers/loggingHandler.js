const winston = require('winston');
const config = require('../config.js');

const transports = [
	new winston.transports.Console(),
];

if (config.LogToFile) {
	transports.push(new winston.transports.File({ filename: 'bot.log' }));
}

const logger = winston.createLogger({
	level: config.LogLevel.toString(),
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		}),
	),
	transports: transports,
});

module.exports = logger;

const winston = require('winston');
const config = require('../config.js');

const transports = [
	new winston.transports.Console(),
];

if (config.LogToFile) {
	transports.push(new winston.transports.File({ filename: 'bot.log' }));
}

const colorizeLevel = level => {
	switch (level) {
	case 'info':
		return '\x1b[36m' + level.toUpperCase() + '\x1b[0m'; // Cyan
	case 'warn':
		return '\x1b[33m' + level.toUpperCase() + '\x1b[0m'; // Yellow
	case 'error':
		return '\x1b[31m' + level.toUpperCase() + '\x1b[0m'; // Red
	default:
		return level.toUpperCase();
	}
};

const formatTimestamp = timestamp => {
	const date = new Date(timestamp).toISOString().replace(/T/, ' - ').replace(/\..+/, '');
	return `[${date}]`;
};

const logger = winston.createLogger({
	level: config.LogLevel.toString(),
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			const coloredLevel = colorizeLevel(level);
			const formattedTimestamp = formatTimestamp(timestamp);
			return `${formattedTimestamp} ${coloredLevel}: ${message}`;
		}),
	),
	transports: transports,
});

module.exports = logger;

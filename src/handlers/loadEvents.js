const fs = require('fs');
const path = require('path');
const logger = require(path.join(__dirname, 'loggingHandler'));

const loadEvents = (dir, client) => {
	const eventFiles = fs.readdirSync(dir);
	logger.info('Started loading events');

	for (const file of eventFiles) {
		const filePath = path.join(dir, file);
		const event = require(filePath);

		if (event && event.name && event.execute) {
			// console.log(event);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args, client));
			}
			else {
				client.on(event.name, (...args) => event.execute(...args, client));
			}
			logger.info(`Loaded event: ${event.name}`);
		}
		else {
			logger.warn(`Skipping ${filePath} - Invalid or missing properties`);
		}
	}

	logger.info('Finished event loading!');
};

module.exports = loadEvents;

const fs = require('fs');
const path = require('path');
const logger = require(path.join(__dirname, 'loggingHandler'));

const loadCommands = (dir, client) => {
	const files = fs.readdirSync(dir);
	logger.info('Started command loading');

	for (const file of files) {
		const filePath = `${dir}/${file}`;
		const stat = fs.lstatSync(filePath);

		if (stat.isDirectory()) {
			loadCommands(filePath, client);
		}
		else if (file.endsWith('.js')) {
			const command = require(filePath);
			// console.log(command);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				logger.info(`Loaded command: ${command}`);
			}
			else {
				logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	logger.info('Finished command loading!');
};

module.exports = loadCommands;

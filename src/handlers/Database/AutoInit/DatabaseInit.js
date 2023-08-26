const logger = require('../../loggingHandler');
const dbManager = require('../databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('../DatabaseModels');
const initEmoji = require('./initFunctions/initEmojis');

const models = initializeModels(sequelizeInstance);
const { Settings } = models;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function initDatabase() {
	try {
		const result = await Settings.findOne({ where: { key: 'autoinitdone', value: '1' } });

		if (result) {
			logger.info('Database is already initialized');
		}
		else {
			logger.warn('Database is not initialized, seems like first boot. Initializing...');
			logger.info('Starting AutoInit in 10 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 9 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 8 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 7 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 6 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 5 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 4 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 3 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 2 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit in 1 seconds...');
			await sleep(1000);
			logger.info('Starting AutoInit...');
			await initEmoji();
			await Settings.create({ key: 'autoinitdone', value: '1' });
			logger.info('AutoInit finished');
		}
	}
	catch (error) {
		logger.error('Error while checking if database is initialized:', error);
		logger.error('Shutting down...');
		logger.error(error.stack);
		process.exit(1);
	}
}

module.exports = initDatabase;

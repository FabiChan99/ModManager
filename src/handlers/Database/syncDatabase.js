const dbManager = require('./databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('./databaseModels');
const logger = require('../loggingHandler');

initializeModels(sequelizeInstance);

async function syncDatabase() {
	try {
		logger.info('Syncing Database...');
		await sequelizeInstance.sync({ force: false });
		logger.info('Datenbank sync completed');
		const dbInit = require('./autoInit/databaseInit');
		await dbInit();
	}
	catch (error) {
		logger.error('Error syncing Database', error);
	}
}

module.exports = syncDatabase;
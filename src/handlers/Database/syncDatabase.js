const dbManager = require('./databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('./databaseModels');
const logger = require('../loggingHandler');

initializeModels(sequelizeInstance);

async function syncDatabase() {
	try {
		logger.info('Synchronisiere Datenbank...');
		await sequelizeInstance.sync({ force: false });
		logger.info('Datenbank synchronisiert');
		const dbInit = require('./autoInit/databaseInit');
		await dbInit();
	}
	catch (error) {
		logger.error('Fehler beim Synchronisieren der Datenbank:', error);
	}
}

module.exports = syncDatabase;
const { Sequelize } = require('sequelize');
const config = require('../../config');
const logger = require('../loggingHandler');

class DbManager {
	constructor() {
		this.config = config;
		this.sequelize = this.initSequelize();
		this.isConnected = false;
	}

	initSequelize() {
		const { dbdriver, dbdatabase, dbusername, dbpassword, dbhost, dblogging = false } = this.config;

		let dialect;


		switch (dbdriver) {
		case 'postgresql':
			dialect = 'postgres';
			break;
		case 'mariadb':
			dialect = 'mariadb';
			break;
		default:
			throw new Error('Unsupported database driver');
		}

		return new Sequelize(dbdatabase, dbusername, dbpassword, {
			host: dbhost,
			dialect,
			logging: dblogging,
		});
	}

	async authenticate() {
		try {
			logger.info('Trying to connect to the database...');
			await this.sequelize.authenticate();
			logger.info('Connection has been established successfully.');
			this.isConnected = true;
		}
		catch (error) {
			logger.error('Unable to connect to the database:', error);
		}
	}

	async close() {
		await this.sequelize.close();
		this.isConnected = false;
	}

	get Sequelize() {
		return this.sequelize;
	}
}

module.exports = DbManager;

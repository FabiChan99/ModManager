const { DataTypes } = require('sequelize');

module.exports = (sequelizeInstance) => {
	const Warns = sequelizeInstance.define('warns', {
		userid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		punisherid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		datum: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		perma: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		caseid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
	}, {
		modelName: 'warns',
		timestamps: false,
		freezeTableName: true,
	});

	const Flags = sequelizeInstance.define('flags', {
		userid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		punisherid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		datum: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		caseid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
	}, {
		modelName: 'flags',
		timestamps: false,
		freezeTableName: true,
	});
	const Settings = sequelizeInstance.define('settings', {
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		modelName: 'settings',
		timestamps: false,
		freezeTableName: true,
	});

	const Timeouts = sequelizeInstance.define('timeouts', {
		userid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		punisherid: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		datum: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		caseid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
	}, {
		modelName: 'timeouts',
		timestamps: false,
		freezeTableName: true,
	});

	const BotEmojs = sequelizeInstance.define('botemojis', {
		emojiname: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		emojistring: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		modelName: 'botemojis',
		timestamps: false,
		freezeTableName: true,
	});


	return { Warns, Flags, Settings, Timeouts, BotEmojs };
};

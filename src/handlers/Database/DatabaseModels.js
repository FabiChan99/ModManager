const { DataTypes } = require('sequelize');

module.exports = (sequelizeInstance) => {
	const Warns = sequelizeInstance.define('warns', {
		userid: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: false, // Kein Primärschlüssel
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

	return Warns;
};

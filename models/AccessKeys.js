/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AccessKeys', {
		accessKeyID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		applicationAlias: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		applicationID: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		accessKeyValue: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		applicationIconUrl: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		isThirdParty: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		isBlocked: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		isDev: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '1'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		softDelete: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'AccessKeys'
	});
};

const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class Role extends Model {}

Role.init(
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
		},
	},
	{
		sequelize,
		modelName: 'roles',
	}
);

module.exports = Role;

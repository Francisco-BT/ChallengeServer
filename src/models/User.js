const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class User extends Model {}

User.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		englishLevel: {
			type: DataTypes.ENUM,
			values: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
		},
		technicalKnowledge: {
			type: DataTypes.TEXT,
		},
		cvLink: {
			type: DataTypes.STRING,
		},
	},
	{ sequelize, modelName: 'users' }
);

module.exports = User;

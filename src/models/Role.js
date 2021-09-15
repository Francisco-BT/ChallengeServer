const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');
const User = require('./User');

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

Role.hasOne(User, { foreignKey: { name: 'roleId', allowNull: false } });

module.exports = Role;

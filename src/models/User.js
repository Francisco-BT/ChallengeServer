const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');
const Role = require('./Role')

class User extends Model {
  static englishLevels() {
    return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  }
}

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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    englishLevel: {
      type: DataTypes.ENUM,
      values: User.englishLevels(),
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

User.belongsTo(Role, {as: 'role', foreignKey: { name: 'roleId', allowNull: false }})

module.exports = User;

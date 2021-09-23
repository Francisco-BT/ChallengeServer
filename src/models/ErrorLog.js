const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class ErrorLog extends Model {}

ErrorLog.init(
  {
    method: DataTypes.STRING,
    path: DataTypes.STRING,
    headers: DataTypes.JSON,
    timestamp: DataTypes.DATE,
    query: DataTypes.JSON,
    body: DataTypes.JSON,
    errors: DataTypes.JSON,
    statusCode: DataTypes.INTEGER,
    ip: DataTypes.STRING,
    message: DataTypes.STRING,
    errorClass: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'errorlogs',
    timestamps: false,
  }
);

module.exports = ErrorLog;

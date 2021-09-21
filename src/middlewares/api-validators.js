const { body } = require('express-validator');
const validate = require('./validate');
const CustomValidator = require('./custom-validators');

const customValidator = new CustomValidator(body);

exports.newUserValidator = () => {
  const validations = [
    customValidator.name(),
    customValidator.email(),
    customValidator.password(),
    customValidator.englishLevel(),
    customValidator.cvLink(),
    customValidator.role(),
    validate,
  ];
  return validations;
};

exports.updateUserValidator = () => {
  return [
    customValidator.emptyBody(),
    customValidator.name().optional(),
    customValidator.englishLevel(),
    customValidator.cvLink(),
    validate,
  ];
};

exports.newAccountValidator = () => {
  return [
    CustomValidator.notEmptyWithMessage(body('name'), 'Name cannot be null'),
    CustomValidator.notEmptyWithMessage(
      body('clientName'),
      'Client Name cannot be null'
    ),
    customValidator.responsibleName(),
    validate,
  ];
};

exports.updateAccountValidator = () => {
  return [
    CustomValidator.notEmptyWithMessage(
      body('name'),
      'Name cannot be null'
    ).optional(),
    CustomValidator.notEmptyWithMessage(
      body('clientName'),
      'Client Name cannot be null'
    ).optional(),
    customValidator.responsibleName().optional(),
    validate,
  ];
};

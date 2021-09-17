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

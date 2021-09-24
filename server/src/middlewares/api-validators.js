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
    customValidator.technicalKnowledge(),
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
    customValidator.technicalKnowledge(),
    validate,
  ];
};

exports.newAccountValidator = () => {
  return [
    customValidator.accountName(),
    customValidator.clientName(),
    customValidator.responsibleName(),
    validate,
  ];
};

exports.updateAccountValidator = () => {
  return [
    customValidator.accountName().optional(),
    customValidator.clientName().optional(),
    customValidator.responsibleName().optional(),
    validate,
  ];
};

exports.newTeamValidator = () => {
  return [customValidator.accountId(), customValidator.teamMembers(), validate];
};

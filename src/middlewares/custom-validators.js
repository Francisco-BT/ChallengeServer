const { check, body } = require('express-validator');
const { User } = require('../models');
const { isEmptyObject } = require('../utils');

class CustomValidator {
  constructor(validateOn = check) {
    this.validateOn = validateOn;
  }

  static notEmptyWithMessage(validationChain, message) {
    return validationChain.notEmpty().withMessage(message).bail();
  }

  name(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('name'),
      'Name cannot be null'
    )
      .isAlpha('en-US', { ignore: / | ./g })
      .withMessage('Name cannot contain numbers or special characters just .')
      .bail()
      .not()
      .isBoolean()
      .withMessage('Name must be a string');
  }

  englishLevel(validate = this.validateOn) {
    return validate('englishLevel')
      .optional()
      .isIn(User.englishLevels())
      .withMessage(
        `English Level must be either (${User.englishLevels().join(', ')})`
      );
  }

  cvLink(validate = this.validateOn) {
    return validate('cvLink')
      .optional()
      .isURL()
      .withMessage('CV Link must have an URL format');
  }

  password(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('password'),
      'Password cannot be null'
    )
      .isLength({ min: 8 })
      .withMessage('Password must have at least 8 characters')
      .bail()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      .withMessage(
        'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number'
      );
  }
  email(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('email'),
      'Email cannot be null'
    )
      .isEmail()
      .withMessage('Email format is wrong');
  }

  role(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('roleId'),
      'Role cannot be null'
    )
      .isNumeric()
      .isInt({ gt: 0 })
      .withMessage('Role is not valid');
  }

  technicalKnowledge(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('technicalKnowledge'),
      'Technical Knowledge cannot be null'
    )
      .not()
      .isBoolean()
      .withMessage('Technical Knowledge must be a string')
      .optional();
  }

  responsibleName(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('responsibleName'),
      'Responsible Name cannot be null'
    )
      .isAlpha('en-US', { ignore: / | ./g })
      .withMessage(
        'Responsible Name cannot contain numbers or special characters just .'
      )
      .bail()
      .not()
      .isBoolean()
      .withMessage('Responsible Name must be a string');
  }

  accountName(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('name'),
      'Name cannot be null'
    )
      .not()
      .isBoolean()
      .withMessage('Name must be a string');
  }

  clientName(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('clientName'),
      'Client Name cannot be null'
    )
      .not()
      .isBoolean()
      .withMessage('Client Name must be a string');
  }

  accountId(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('accountId'),
      'Account ID cannot be null'
    )
      .isInt()
      .withMessage('Account ID must be an integer')
      .bail()
      .not()
      .isArray()
      .withMessage('Account ID must be an integer');
  }

  teamMembers(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('members'),
      'Members cannot be empty'
    )
      .isArray()
      .withMessage('Members must be an array of integers');
  }

  emptyBody() {
    return body()
      .custom((body) => !isEmptyObject(body))
      .withMessage('There are no fields to update');
  }
}

module.exports = CustomValidator;

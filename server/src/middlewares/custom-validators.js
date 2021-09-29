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
      validate('name').trim(),
      'Name cannot be empty'
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
      validate('password').trim(),
      'Password cannot be empty'
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
      validate('email').trim(),
      'Email cannot be empty'
    )
      .isEmail()
      .withMessage('Email format is wrong');
  }

  role(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('roleId').trim(),
      'Role cannot be empty'
    )
      .isNumeric()
      .isInt({ gt: 0 })
      .withMessage('Role is not valid');
  }

  technicalKnowledge(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('technicalKnowledge').trim(),
      'Technical Knowledge cannot be empty'
    )
      .not()
      .isBoolean()
      .withMessage('Technical Knowledge must be a string')
      .optional();
  }

  responsibleName(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('responsibleName').trim(),
      'Responsible Name cannot be empty'
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
      validate('name').trim(),
      'Name cannot be empty'
    )
      .not()
      .isBoolean()
      .withMessage('Name must be a string');
  }

  clientName(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('clientName').trim(),
      'Client Name cannot be empty'
    )
      .not()
      .isBoolean()
      .withMessage('Client Name must be a string');
  }

  accountId(validate = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validate('accountId'),
      'Account ID cannot be empty'
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

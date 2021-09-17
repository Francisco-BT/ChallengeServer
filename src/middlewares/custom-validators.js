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
      .withMessage('Name cannot contain numbers or special characters just .');
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

  role(validateOn = this.validateOn) {
    return CustomValidator.notEmptyWithMessage(
      validateOn('roleId'),
      'Role cannot be null'
    )
      .isNumeric()
      .isInt({ gt: 0 })
      .withMessage('Role is not valid');
  }

  emptyBody() {
    return body()
      .custom((body) => !isEmptyObject(body))
      .withMessage('There are no fields to update');
  }
}

module.exports = CustomValidator;

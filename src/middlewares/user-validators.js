const { body } = require('express-validator');
const { notEmptyWithMessage } = require('./custom-validators');
const validate = require('./validate');
const { User } = require('../models');

exports.newUserValidator = () => {
  const validations = [
    notEmptyWithMessage(body('name'), 'Name cannot be null')
      .isAlpha('en-US', { ignore: / | ./g })
      .withMessage('Name cannot contain numbers or special characters just .'),
    notEmptyWithMessage(body('email'), 'Email cannot be null')
      .isEmail()
      .withMessage('Email format is wrong'),
    notEmptyWithMessage(body('password'), 'Password cannot be null')
      .isLength({ min: 8 })
      .withMessage('Password must have at least 8 characters')
      .bail()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      .withMessage(
        'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number'
      ),
    body('englishLevel')
      .optional()
      .isIn(User.englishLevels())
      .withMessage(
        `English Level must be either (${User.englishLevels().join(', ')})`
      ),
    body('cvLink')
      .optional()
      .isURL()
      .withMessage('CV Link must have an URL format'),
    validate,
  ];
  return validations;
};

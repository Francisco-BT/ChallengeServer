const bcrypt = require('bcrypt');
const { EncryptException } = require('./errors');

exports.encrypt = async (text, algorithm = bcrypt) => {
  try {
    return await algorithm.hash(text, 10);
  } catch {
    throw new EncryptException();
  }
};

exports.compareEncrypted = async (text, encrypted, algorithm = bcrypt) => {
  try {
    return await algorithm.compare(text, encrypted);
  } catch {
    return false;
  }
};

exports.getTokenFromHeaders = (req) => {
  return req.headers.authorization.split(' ')[1];
};

exports.isEmptyObject = (object) => Object.keys(object).length === 0;

exports.pickValue = (option1, option2) => (option1 ? option1 : option2);

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

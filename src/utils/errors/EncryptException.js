class EncryptException extends Error {
  constructor() {
    super('Error encrypting the data');
  }
}

module.exports = { EncryptException };

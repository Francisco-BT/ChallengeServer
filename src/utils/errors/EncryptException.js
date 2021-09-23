class EncryptException extends Error {
  constructor() {
    super('Error encrypting the data');
    this.name = 'EncryptException';
  }
}

module.exports = { EncryptException };

const APIException = require('./APIException');

class TokenGenerationException extends APIException {
  constructor() {
    super('Error generating the token', 400);
    this.name = 'TokenGenerationException';
  }
}

module.exports = TokenGenerationException;

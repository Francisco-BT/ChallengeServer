const APIException = require('./APIException');

class TokenGenerationException extends APIException {
  constructor() {
    super('Error generating the token', 400);
  }
}

module.exports = TokenGenerationException;

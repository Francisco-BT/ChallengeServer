const APIException = require('./APIException');

class AuthenticationException extends APIException {
  constructor(message = 'Invalid Credentials') {
    super(message, 401);
  }
}

module.exports = AuthenticationException;

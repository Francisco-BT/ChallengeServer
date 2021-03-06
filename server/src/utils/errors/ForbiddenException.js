const APIException = require('./APIException');

class ForbiddenException extends APIException {
  constructor(message = 'You are not able to access to the resource') {
    super(message, 403);
    this.name = 'ForbiddenException';
  }
}

module.exports = ForbiddenException;

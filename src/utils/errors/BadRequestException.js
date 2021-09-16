const APIException = require('./APIException');

class BadRequestException extends APIException {
  constructor() {
    super('Invalid Request', 400);
  }
}

module.exports = BadRequestException;

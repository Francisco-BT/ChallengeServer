const APIException = require('./APIException');

class BadRequestException extends APIException {
  constructor() {
    super('Invalid Request', 400);
    this.name = 'BadRequestException';
  }
}

module.exports = BadRequestException;

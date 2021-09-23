const APIException = require('./APIException');

class ValidationsException extends APIException {
  constructor(errors) {
    super('One or more fields are not valid', 400, errors);
    this.name = 'ValidationsException';
  }
}

module.exports = ValidationsException;

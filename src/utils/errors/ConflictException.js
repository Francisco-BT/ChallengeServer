const APIException = require('./APIException');

class ConflictException extends APIException {
  constructor() {
    super(
      'Ups, looks like there is a conflict, please validate your data',
      409
    );
  }
}

module.exports = ConflictException;

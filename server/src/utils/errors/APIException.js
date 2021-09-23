class APIException extends Error {
  constructor(message = '', status = 500, errors = undefined) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'APIException';
  }
}

module.exports = APIException;

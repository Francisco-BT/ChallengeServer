const { createResponse } = require('node-mocks-http');
const { errorHandler } = require('../../src/middlewares');
const { APIException } = require('../../src/utils/errors');

describe('Error Handler Middleware', () => {
  let req,
    res = createResponse(),
    next;

  beforeEach(() => {
    res = createResponse();
    req = jest.fn();
    next = jest.fn();
  });

  it('should be a function', () => {
    expect(typeof errorHandler).toBe('function');
  });

  it('should return the error status code received', () => {
    errorHandler(new APIException('', 502), req, res, next);
    expect(res.statusCode).toBe(502);
  });

  it('should return status 500 if the status is not defined', () => {
    errorHandler({}, req, res, next);
    expect(res.statusCode).toBe(500);
  });

  it('should return the message Internal Server Error if the message is not defined', () => {
    errorHandler({}, req, res, next);
    expect(res._getJSONData().message).toBe('Internal Server Error');
  });

  it('should return an error message in the response', () => {
    errorHandler(new APIException('Custom Message Error'), req, res, next);
    expect(res._getJSONData().message).toBeDefined();
    expect(res._getJSONData().message).toBe('Custom Message Error');
  });

  it('should return a timestamp in the body', () => {
    const todayInMs = new Date().getTime();
    const todayPlus5Seconds = todayInMs + 5 * 1000;
    errorHandler({}, req, res, next);

    const timestamp = res._getJSONData().timestamp;
    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThanOrEqual(todayInMs);
    expect(timestamp).toBeLessThan(todayPlus5Seconds);
  });

  it('should return an error object with failed validations', () => {
    const errors = { something: 'Validation Error' };
    errorHandler(new APIException('', null, errors), req, res, next);

    const body = res._getJSONData();
    expect(body.errors).toBeDefined();
    expect(typeof body.errors).toBe('object');
    expect(body.errors).toEqual({ something: 'Validation Error' });
  });
});

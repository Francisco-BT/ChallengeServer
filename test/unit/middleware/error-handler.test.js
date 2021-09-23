const { createResponse, createRequest } = require('node-mocks-http');
const { errorHandler } = require('../../../src/middlewares');
const { APIException } = require('../../../src/utils/errors');
const { ErrorLog } = require('../../../src/models');
const { sequelize } = require('../../../src/services');

let req = createRequest(),
  res = createResponse(),
  next;
const originalCreate = ErrorLog.create;

beforeEach(() => {
  res = createResponse();
  req = createRequest();
  next = jest.fn();
  ErrorLog.create = jest.fn();
});

beforeAll(async () => await sequelize.sync({ force: true }));

afterAll(async () => {
  ErrorLog.create = originalCreate;
  await sequelize.close();
});

describe('Error Handler Middleware', () => {
  it('should be a function', () => {
    expect(typeof errorHandler).toBe('function');
  });

  it('should return the error status code received', async () => {
    await errorHandler(new APIException('', 502), req, res, next);
    expect(res.statusCode).toBe(502);
  });

  it('should return status 500 if the status is not defined', async () => {
    await errorHandler({}, req, res, next);
    expect(res.statusCode).toBe(500);
  });

  it('should return the message Internal Server Error if the message is not defined', async () => {
    await errorHandler(new APIException(), req, res, next);
    expect(res._getJSONData().message).toBe('Internal Server Error');
  });

  it('should return an error message in the response', async () => {
    await errorHandler(
      new APIException('Custom Message Error'),
      req,
      res,
      next
    );
    expect(res._getJSONData().message).toBeDefined();
    expect(res._getJSONData().message).toBe('Custom Message Error');
  });

  it('should return a timestamp in the body', async () => {
    const todayInMs = new Date().getTime();
    const todayPlus5Seconds = todayInMs + 5 * 1000;
    await errorHandler({}, req, res, next);

    const timestamp = res._getJSONData().timestamp;
    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThanOrEqual(todayInMs);
    expect(timestamp).toBeLessThan(todayPlus5Seconds);
  });

  it('should return an error object with failed validations', async () => {
    const errors = { something: 'Validation Error' };
    await errorHandler(new APIException('', null, errors), req, res, next);

    const body = res._getJSONData();
    expect(body.errors).toBeDefined();
    expect(typeof body.errors).toBe('object');
    expect(body.errors).toEqual({ something: 'Validation Error' });
  });
});

describe('Save error into DB', () => {
  it('should call ErrorLog.create', async () => {
    await errorHandler(new Error(), req, res, next);
    expect(ErrorLog.create).toHaveBeenCalled();
  });

  it('should call create with error data', async () => {
    await errorHandler(new APIException('12312', 404), req, res, next);
    expect(ErrorLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '12312',
        statusCode: 404,
        body: {},
        headers: {},
        query: {},
      })
    );
  });

  it('should not throw an error if something fails', async () => {
    const consoleLogBackup = console.log;
    ErrorLog.create = jest.fn().mockRejectedValueOnce(new Error());
    console.log = jest.fn();
    await errorHandler({}, req, res, next);
    expect(console.log).toHaveBeenCalled();
    console.log = consoleLogBackup;
  });
});

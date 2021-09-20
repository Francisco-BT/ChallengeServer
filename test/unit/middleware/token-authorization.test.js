const { tokenAuthorization } = require('../../../src/middlewares');
const { createRequest, createResponse } = require('node-mocks-http');
const { User } = require('../../../src/models');
const { generateToken } = require('../../../src/utils');
const { ForbiddenException } = require('../../../src/utils/errors');
const passport = require('passport');

describe('Token Authorization Middleware', () => {
  let req,
    res,
    next,
    originalFindByPk = User.findByPk;

  beforeEach(async () => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    const token = await generateToken({ id: 1 }, { create: jest.fn() });
    req.headers.authorization = `Bearer ${token}`;
    User.findByPk = jest.fn();
    passport.initialize()(req, res, next);
  });

  afterAll(() => (User.findByPk = originalFindByPk));

  it('should have a tokenAuthorization function', () => {
    expect(typeof tokenAuthorization).toBe('function');
  });

  it('should return 401 Unauthorized if token is invalid', async () => {
    req.headers.authorization = 'Bearer thisisnotajwttoken';
    await tokenAuthorization()(req, res, next);

    expect(res.statusCode).toBe(401);
  });

  it('should call User.findByPk if the token in req.headers is valid in the middleware', async () => {
    await tokenAuthorization()(req, res, next);
    expect(User.findByPk).toHaveBeenCalled();
  });

  it('should call next with ForbbidenException if user not exist', async () => {
    User.findByPk = jest.fn().mockReturnValueOnce(null);
    await tokenAuthorization()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });

  it('should call next with ForbbidenException if an error ocurred', async () => {
    User.findByPk = jest.fn().mockReturnValueOnce(null);
    await tokenAuthorization()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });
});

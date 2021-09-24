const { tokenAuthorization } = require('../../../src/middlewares');
const { createRequest, createResponse } = require('node-mocks-http');
const { User, Token } = require('../../../src/models');
const { generateToken } = require('../../../src/utils');
const passport = require('passport');

describe('Token Authorization Middleware', () => {
  let req,
    res,
    next,
    originalFindByPk = User.findByPk,
    token;

  beforeEach(async () => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    token = await generateToken({ id: 1 }, { create: jest.fn() });
    req.headers.authorization = `Bearer ${token}`;
    User.findByPk = jest.fn();
    jest.spyOn(Token, 'findOne').mockResolvedValueOnce({ id: 1, token });
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

  it('should call Token.findOne with the token', async () => {
    await tokenAuthorization()(req, res, next);
    expect(Token.findOne).toHaveBeenCalledWith({ where: { token } });
  });
});

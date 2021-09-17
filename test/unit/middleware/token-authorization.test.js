const { tokenAuthorization } = require('../../../src/middlewares');
const { createRequest, createResponse } = require('node-mocks-http');
const { User } = require('../../../src/models');
const { generateToken } = require('../../../src/utils');
const { ForbiddenException } = require('../../../src/utils/errors');

describe('Token Authorization Middleware', () => {
  let req,
    res,
    next,
    originalFindByPk = User.findByPk;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    const token = generateToken({ id: 1 });
    req.headers.authorization = `Bearer ${token}`;
    User.findByPk = jest.fn();
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

  fit('should call next with ForbiddenException if user not exist', async () => {
    User.findByPk = jest.fn().mockRejectedValue(new Error());
    tokenAuthorization()(req, res, next);
    console.log('Next: ', next.mock);
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });
});

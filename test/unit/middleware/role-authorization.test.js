const { createRequest, createResponse } = require('node-mocks-http');
const { roleAuthorization } = require('../../../src/middlewares');
const { ForbiddenException } = require('../../../src/utils/errors');

describe('Role Authorization Middleware', () => {
  let next = jest.fn(),
    res = createResponse(),
    req = createRequest();

  beforeEach(() => {
    next = jest.fn();
    req = createRequest();
    res = createResponse();
  });

  it('should have a middleware function roleAuthorization', () => {
    expect(typeof roleAuthorization).toBe('function');
  });

  it('should call next with ForbiddenException if there is no user on the req.body', () => {
    roleAuthorization([])(req, res, next);
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });

  it('should call next if the array of valid roles provided contains the req.user.role', () => {
    req.user = { role: 'SuperAdmin' };
    const roles = ['Normal', 'SuperAdmin'];
    roleAuthorization(roles)(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with ForbiddenException if the array of valid roles is empty', () => {
    roleAuthorization([])(req, res, next);
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });

  it('should call next with ForbiddenException if the user role is not defined in the array of valid roles', () => {
    req.user = { role: 'Normal' };
    const validRoles = ['Admin'];
    roleAuthorization(validRoles)(req, res, next);
    expect(next).toHaveBeenCalledWith(new ForbiddenException());
  });
});

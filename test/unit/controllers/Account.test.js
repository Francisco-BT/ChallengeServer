const { createRequest, createResponse } = require('node-mocks-http');
const { AccountController } = require('../../../src/controllers');
const { APIException } = require('../../../src/utils/errors');

describe('Account Controller', () => {
  const AccountMockModel = {
    create: jest.fn(),
  };
  let req, res, next, sut;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    sut = new AccountController(AccountMockModel);
  });

  describe('Create a new account', () => {
    const mockUserCreate = {
      id: 1,
      name: 'TestAccount',
      clientName: 'TestClient',
      responsible: 'TestResponsible',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      req.body = {
        name: 'TestAccount',
        clientName: 'TestClient',
        responsible: 'TestResponsible',
      };
    });

    it('should have a create function', () => {
      expect(typeof new AccountController().create).toBe('function');
    });

    it('should call Account.create with name, clientName, responsible from req.body', async () => {
      AccountMockModel.create.mockResolvedValueOnce(mockUserCreate);
      await sut.create(req, res, next);
      expect(AccountMockModel.create).toHaveBeenCalledWith({
        name: 'TestAccount',
        clientName: 'TestClient',
        responsible: 'TestResponsible',
      });
    });

    it('should return 201 - with the account data', async () => {
      AccountMockModel.create.mockResolvedValueOnce(mockUserCreate);
      await sut.create(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual({
        id: 1,
        name: 'TestAccount',
        clientName: 'TestClient',
        responsibleName: 'TestResponsible',
      });
    });

    it('should call next with APIException if saved the account fail', async () => {
      AccountMockModel.create.mockRejectedValueOnce(new Error());
      await sut.create(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });
});

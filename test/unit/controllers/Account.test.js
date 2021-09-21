const { createRequest, createResponse } = require('node-mocks-http');
const { AccountController } = require('../../../src/controllers');
const {
  APIException,
  BadRequestException,
} = require('../../../src/utils/errors');

describe('Account Controller', () => {
  const AccountMockModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };
  let req, res, next, sut;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    sut = new AccountController(AccountMockModel);
  });

  const mockAccount = {
    id: 1,
    name: 'TestAccount',
    clientName: 'TestClient',
    responsibleName: 'TestResponsible',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Create a new account', () => {
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
      AccountMockModel.create.mockResolvedValueOnce(mockAccount);
      await sut.create(req, res, next);
      expect(AccountMockModel.create).toHaveBeenCalledWith({
        name: 'TestAccount',
        clientName: 'TestClient',
        responsible: 'TestResponsible',
      });
    });

    it('should return 201 - with the account data', async () => {
      AccountMockModel.create.mockResolvedValueOnce(mockAccount);
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

  describe('Get all accounts', () => {
    beforeEach(() => {
      AccountMockModel.findAndCountAll.mockResolvedValueOnce({
        count: 0,
        rows: [],
      });
    });
    it('should have a function to get all accounts', async () => {
      expect(typeof sut.getAll).toBe('function');
    });

    it('should call Account.findAndCountAll', async () => {
      await sut.getAll(req, res, next);
      expect(AccountMockModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should call Account.findAndCountAll with offset 0 and limit 10 if there is no page and limit in req.query', async () => {
      req.query = {};
      await sut.getAll(req, res, next);
      expect(AccountMockModel.findAndCountAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
      });
    });

    it('should return 200 in the response', async () => {
      await sut.getAll(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return an array of items in the response body', async () => {
      await sut.getAll(req, res, next);
      const body = res._getJSONData();
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBeTruthy();
    });

    it('should return a pagination object in the response', async () => {
      await sut.getAll(req, res, next);
      const body = res._getJSONData();
      expect(body).toHaveProperty('pagination');
      expect(Object.keys(body.pagination)).toEqual([
        'totalPages',
        'limit',
        'hasNext',
        'hasPrevious',
        'currentPage',
        'total',
      ]);
    });

    it('should return just the id, name, clientName, responsibleName for each item returned', async () => {
      AccountMockModel.findAndCountAll = jest.fn().mockResolvedValueOnce({
        count: 1,
        rows: [
          {
            id: 1,
            name: 'Name',
            clientName: 'ClientName',
            responsibleName: 'Responsible',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      await sut.getAll(req, res, next);
      const body = res._getJSONData();
      expect(Object.keys(body.items[0])).toEqual([
        'id',
        'name',
        'clientName',
        'responsibleName',
      ]);
    });

    it('should call next with APIException if findAndCountAll fail', async () => {
      AccountMockModel.findAndCountAll = jest
        .fn()
        .mockRejectedValueOnce(new Error());
      await sut.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Get one account', () => {
    beforeEach(() => {
      AccountMockModel.findByPk = jest.fn().mockResolvedValueOnce(mockAccount);
    });

    it('should have getAccount method', () => {
      expect(typeof sut.getAccount).toBe('function');
    });

    it('should call Account.findByPk using req.params.id', async () => {
      req.params.id = '1';
      await sut.getAccount(req, res, next);
      expect(AccountMockModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return 200 in the response', async () => {
      await sut.getAccount(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return the account name, clientName and responsibleName in the response.body', async () => {
      await sut.getAccount(req, res, next);
      const body = res._getJSONData();
      expect(Object.keys(body)).toEqual([
        'id',
        'name',
        'clientName',
        'responsibleName',
      ]);
    });

    it('should call next with BadRequestException if the account not exist', async () => {
      AccountMockModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.getAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if findByPk fails', async () => {
      AccountMockModel.findByPk = jest.fn().mockRejectedValueOnce(new Error());
      await sut.getAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Delete Account', () => {
    let destroy;
    beforeEach(() => {
      destroy = jest.fn();
      AccountMockModel.findByPk = jest
        .fn()
        .mockResolvedValueOnce({ ...mockAccount, destroy });
    });

    it('should have a deleteAccount method', () => {
      expect(typeof sut.deleteAccount).toBe('function');
    });

    it('should call Account.findByPk with req.params.id', async () => {
      req.params.id = '1';
      await sut.deleteAccount(req, res, next);
      expect(AccountMockModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should call destroy to the account returned by findByPk', async () => {
      await sut.deleteAccount(req, res, next);
      expect(destroy).toHaveBeenCalled();
    });

    it('should return 204 in the response', async () => {
      await sut.deleteAccount(req, res, next);
      expect(res.statusCode).toBe(204);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with BadRequestException if account is not found', async () => {
      AccountMockModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.deleteAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if findByPk fails', async () => {
      AccountMockModel.findByPk = jest.fn().mockRejectedValueOnce(new Error());
      await sut.deleteAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Update account', () => {
    let save;
    beforeEach(() => {
      req.params.id = '1';
      save = jest.fn();
      AccountMockModel.findByPk = jest.fn().mockResolvedValueOnce({
        ...mockAccount,
        save,
      });
    });

    it('should have an updated account function', () => {
      expect(typeof sut.updateAccount).toBe('function');
    });

    it('should call Account.findByPk with req.params.id', async () => {
      await sut.updateAccount(req, res, next);
      expect(AccountMockModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should call saved to update the entry', async () => {
      await sut.updateAccount(req, res, next);
      expect(save).toHaveBeenCalled();
    });

    it('should return 200 in the response', async () => {
      await sut.updateAccount(req, res, next);
      expect(res.statusCode).toBe(200);
    });

    it('should not update the fields if there are not in the req.body', async () => {
      req.body = {};
      await sut.updateAccount(req, res, next);
      const body = res._getJSONData();
      expect(body.name).toBe(mockAccount.name);
      expect(body.clientName).toBe(mockAccount.clientName);
      expect(body.responsibleName).toBe(mockAccount.responsibleName);
    });

    it.each([
      {
        field: 'name',
        updatedValue: 'NameUpdated',
      },
      {
        field: 'clientName',
        updatedValue: 'ClientNameUpdated',
      },
      {
        field: 'responsibleName',
        updatedValue: 'ResponsibleUpdated',
      },
    ])(
      'should update $field if is in the req.body and returned in the response.body as $updatedValue',
      async ({ field, updatedValue }) => {
        req.body[field] = updatedValue;
        await sut.updateAccount(req, res, next);
        const body = res._getJSONData();
        expect(body[field]).toBe(updatedValue);
      }
    );

    it('should call next with BadRequestException if the account does not exist', async () => {
      AccountMockModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.updateAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if findByPk fails', async () => {
      AccountMockModel.findByPk = jest.fn().mockRejectedValueOnce(new Error());
      await sut.updateAccount(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });
});

const { UserController } = require('../../src/controllers');
const { createResponse, createRequest } = require('node-mocks-http');
const { encrypt } = require('../../src/utils');

let sut, res, mockUserModel, req;

beforeEach(() => {
  mockUserModel = {
    create: jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test',
      email: 'test1@mail.com',
    }),
  };
  res = createResponse();
  req = createRequest();
  sut = new UserController(mockUserModel);
});

describe('User Controller', () => {
  describe('Create User', () => {
    beforeEach(() => {
      req.body = {
        name: 'Test',
        email: 'test1@mail.com',
        password: 'p4ssw0rd',
      };
    });

    it('should have a method create()', () => {
      expect(typeof sut.create).toBe('function');
    });

    it('should call User.create() to interact with the DB', async () => {
      await sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should call User.create() with name, email and encrypted password', async () => {
      await sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test', email: 'test1@mail.com' })
      );
      expect(mockUserModel.create).not.toHaveBeenCalledWith(
        expect.objectContaining({ password: 'p4ssw0rd' })
      );
    });

    it('should response Created - 201 on success', async () => {
      await sut.create(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('should return the same name and email with id on success', async () => {
      await sut.create(req, res);
      const userData = res._getJSONData();
      expect(userData).toHaveProperty('id');
      expect(userData).not.toHaveProperty('password');
      expect(userData.name).toBe('Test');
      expect(userData.email).toBe('test1@mail.com');
    });
  });
});

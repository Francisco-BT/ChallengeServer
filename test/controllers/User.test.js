const { UserController } = require('../../src/controllers');
const { createResponse, createRequest } = require('node-mocks-http');

let sut, res, mockUserModel, req;

beforeEach(() => {
  mockUserModel = {
    create: jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test',
      email: 'test1@mail.com',
      password: 'p4ssw0rd',
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

    it('should call User.create() to interact with the DB', () => {
      sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should call User.create() with name, email and password', () => {
      sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test1@mail.com',
        password: 'p4ssw0rd',
      });
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

    it.skip('should save encrypted password', async () => {});
  });
});

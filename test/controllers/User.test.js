const { createResponse, createRequest } = require('node-mocks-http');
const { UserController } = require('../../src/controllers');
const { encrypt } = require('../../src/utils');
const {
  APIException,
  AuthenticationException,
} = require('../../src/utils/errors');

let sut, res, mockUserModel, req, next;

beforeEach(() => {
  mockUserModel = {
    create: jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test',
      email: 'test1@mail.com',
    }),
    findAll: jest.fn().mockResolvedValueOnce([
      {
        id: 1,
        name: 'User 1',
        email: 'user1@mail.com',
        englishLevel: null,
        technicalKnowledge: null,
        cvLink: null,
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@mail.com',
        englishLevel: 'A2',
        technicalKnowledge: null,
        cvLink: 'www.google.com',
      },
    ]),
  };
  res = createResponse();
  req = createRequest();
  sut = new UserController(mockUserModel);
  next = jest.fn();
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

    it('should call next with APIException on error', async () => {
      mockUserModel.create = jest.fn().mockRejectedValueOnce(new Error());
      await sut.create(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Get All Users', () => {
    it('should have a getAll function', () => {
      expect(typeof sut.getAll).toBe('function');
    });

    it('should call User.findAll()', async () => {
      await sut.getAll(req, res, {});
      expect(mockUserModel.findAll).toHaveBeenCalled();
    });

    it('should return 200 - OK in the response', async () => {
      await sut.getAll(req, res, {});
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a list of users in the response', async () => {
      mockUserModel.findAll = jest.fn().mockResolvedValue([
        { id: 1, name: 'User 1', email: 'user1@mail.com' },
        { id: 2, name: 'User 2', email: 'user2@mail.com' },
      ]);
      await sut.getAll(req, res, {});
      const body = res._getJSONData();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBe(2);
    });

    it('should return id, name, email, englishLevel, technicalKnowledge, cvLink per user', async () => {
      await sut.getAll(req, res, {});
      const body = res._getJSONData();
      const returnedFields = [
        'id',
        'name',
        'email',
        'englishLevel',
        'technicalKnowledge',
        'cvLink',
      ];
      expect(Object.keys(body[0])).toEqual(returnedFields);
      expect(Object.keys(body[1])).toEqual(returnedFields);
    });

    it('should call next with APIException on error', async () => {
      mockUserModel.findAll = jest.fn().mockRejectedValueOnce(new Error());
      await sut.getAll(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Auth User', () => {
    const authReturnedUser = {
      id: 1,
      email: 'user@me.com',
      name: 'User',
    };
    beforeEach(async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce({
        ...authReturnedUser,
        password: await encrypt('MySuperPassword'),
      });
    });

    it('should have an authenticate function', () => {
      expect(typeof sut.authenticate).toBe('function');
    });

    it('should called User.findOne()', async () => {
      await sut.authenticate(req, res, next);
      expect(mockUserModel.findOne).toHaveBeenCalled();
    });

    it('should user a where clause to get user by req.body.email using User.findOne', async () => {
      req.body.email = 'user@me.com';
      await sut.authenticate(req, res, next);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: {
          email: 'user@me.com',
        },
      });
    });

    it('should return call next with AuthenticationException if user not exist', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      await sut.authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new AuthenticationException());
    });

    it('should call next with AuthenticationException if req.body.password does not match with user.password', async () => {
      await sut.authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(new AuthenticationException());
    });

    it('should call next with APIException if something went wrong', async () => {
      mockUserModel.findOne = jest.fn().mockRejectedValueOnce(new Error());
      await sut.authenticate(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });

    it('should return 200 if user and password are correct', async () => {
      req.body = {
        email: 'user@me.com',
        password: 'MySuperPassword',
      };
      await sut.authenticate(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return id, name and token in body if credentials are correct', async () => {
      req.body = {
        email: 'user@me.com',
        password: 'MySuperPassword',
      };
      await sut.authenticate(req, res, next);

      const body = res._getJSONData();
      expect(Object.keys(body)).toEqual(['id', 'name', 'token']);
      expect(body.id).toBe(authReturnedUser.id);
      expect(body.name).toBe(authReturnedUser.name);
    });
  });
});

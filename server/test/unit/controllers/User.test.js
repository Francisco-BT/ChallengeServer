const { createResponse, createRequest } = require('node-mocks-http');
const { UserController } = require('../../../src/controllers');
const { encrypt } = require('../../../src/utils');
const {
  APIException,
  AuthenticationException,
  ValidationsException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} = require('../../../src/utils/errors');
const { sequelize } = require('../../../src/services');

describe('User Controller', () => {
  let sut, res, req, next, mockUserModel, mockRoleModel;
  const resolvedUser = {
    id: 1,
    name: 'Test',
    email: 'test1@mail.com',
    englishLevel: 'A1',
    cvLink: 'www.google.com',
    technicalKnowledge: 'My technical knowledge',
    role: 'TestRole',
  };

  const mockTokenModel = {
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn(),
    destroy: jest.fn(),
  };

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    mockRoleModel = {
      findByPk: jest.fn().mockResolvedValueOnce({
        id: 1,
        name: 'TestRole',
      }),
    };
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({ ...resolvedUser }),
      findAndCountAll: jest.fn().mockResolvedValueOnce({
        rows: [
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
        ],
        count: 2,
      }),
      findByPk: jest.fn().mockResolvedValueOnce({
        ...resolvedUser,
        englishLevel: 'A2',
        password: '1234',
        technicalKnowledge: null,
        cvLink: null,
        role: { id: 1, name: 'Role' },
      }),
    };
    res = createResponse();
    req = createRequest();
    sut = new UserController(mockUserModel, mockRoleModel, mockTokenModel);
    next = jest.fn();
    req.params.id = '1';
  });

  describe('Create User', () => {
    let getRole;
    beforeEach(() => {
      getRole = jest.fn().mockResolvedValue({ id: 1, name: 'TestRole' });
      mockUserModel.create = jest
        .fn()
        .mockResolvedValueOnce({ ...resolvedUser, getRole });
      req.body = {
        name: 'Test',
        email: 'test1@mail.com',
        password: 'p4ssw0rd',
        roleId: 1,
      };
    });

    it('should have a method create()', () => {
      expect(typeof sut.create).toBe('function');
    });

    it('should call User.create() to interact with the DB', async () => {
      await sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should call User.create() with name, email, roleId and encrypted password', async () => {
      await sut.create(req, res);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test',
          email: 'test1@mail.com',
          roleId: 1,
        })
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

    it('should call User.create and then the method getRole', async () => {
      await sut.create(req, res, next);
      expect(getRole).toHaveBeenCalled();
    });

    it('should return role name on success', async () => {
      await sut.create(req, res);
      const userData = res._getJSONData();
      expect(userData).toHaveProperty('role');
      expect(userData.role).toBe('TestRole');
    });

    it('should call Role.findByPk with the roleId received in the request', async () => {
      await sut.create(req, res);
      expect(mockRoleModel.findByPk).toHaveBeenCalledWith(req.body.roleId);
    });

    it('should call next with ValidationsExepction if the role not exist', async () => {
      mockRoleModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.create(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new ValidationsException({
          roleId: 'Role is not valid',
        })
      );
    });

    it('should call next with ValidationsExepction if the role name is SuperAdmin', async () => {
      mockRoleModel.findByPk = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, name: 'SuperAdmin' });
      await sut.create(req, res, next);
      expect(next).toHaveBeenCalledWith(
        new ValidationsException({
          roleId: 'Role is not valid',
        })
      );
    });

    it('should call User.findOne with email to validate if already exists', async () => {
      mockUserModel.findOne = jest.fn();
      await sut.create(req, res, next);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test1@mail.com' },
      });
    });

    it('should call next with ConflictException if findOne returns no null', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce(1);
      await sut.create(req, res, next);
      expect(next).toHaveBeenCalledWith(new ConflictException());
    });
  });

  describe('Get All Users', () => {
    it('should have a getAll function', () => {
      expect(typeof sut.getAll).toBe('function');
    });

    it('should call User.findAndCountAll()', async () => {
      await sut.getAll(req, res, {});
      expect(mockUserModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should call User.findAndCountAll using offset and limit', async () => {
      req.query = { page: 1, limit: 10 };
      await sut.getAll(req, res, next);
      expect(mockUserModel.findAndCountAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
      });
    });

    it('should return a pagination object that calculate total pages, hasNext and hasPrevious using req.query', async () => {
      req.query = { page: 3, limit: 5 };
      mockUserModel.findAndCountAll = jest.fn().mockResolvedValueOnce({
        rows: [],
        count: 22,
      });
      await sut.getAll(req, res, next);

      const pagination = res._getJSONData().pagination;
      expect(pagination.totalPages).toBe(5);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeTruthy();
    });

    it('should return 200 - OK in the response', async () => {
      await sut.getAll(req, res, {});
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a list of users in the response as items', async () => {
      mockUserModel.findAndCountAll = jest.fn().mockResolvedValue({
        rows: [
          { id: 1, name: 'User 1', email: 'user1@mail.com' },
          { id: 2, name: 'User 2', email: 'user2@mail.com' },
        ],
        count: 2,
      });
      await sut.getAll(req, res, {});
      const body = res._getJSONData();
      expect(Array.isArray(body.items)).toBeTruthy();
      expect(body.items.length).toBe(2);
    });

    it('should return id, name, email, englishLevel, technicalKnowledge, cvLink per user', async () => {
      await sut.getAll(req, res, {});
      const body = res._getJSONData().items;
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
      mockUserModel.findAndCountAll = jest
        .fn()
        .mockRejectedValueOnce(new Error());
      await sut.getAll(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new APIException());
    });

    it('should return a pagination object in the response', async () => {
      await sut.getAll(req, res, next);
      const pagination = res._getJSONData().pagination;
      expect(pagination).toBeDefined();
      expect(Object.keys(pagination)).toEqual(
        expect.arrayContaining([
          'totalPages',
          'currentPage',
          'hasNext',
          'hasPrevious',
          'total',
        ])
      );
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

  describe('Get One User', () => {
    beforeEach(() => {
      req.user = { role: 'SuperAdmin' };
    });

    it('should have a getUser function', () => {
      expect(typeof sut.getUser).toBe('function');
    });

    it('should call User.findByPk with the req.params.id value and the include object with the role if req.user is the same id', async () => {
      req.user = { id: 1 };
      await sut.getUser(req, res, next);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
        include: 'role',
      });
    });

    it('should call User.findByPk with the req.params.id value and the include object with the role if req.user does not have Normal Role', async () => {
      req.user = { role: 'Admin' };
      await sut.getUser(req, res, next);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
        include: 'role',
      });
    });

    it('should called next if the req.user has role Normal but different id that req.params', async () => {
      req.params.id = 100;
      req.user = { role: 'Normal', id: 101 };
      await sut.getUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new ForbiddenException());
    });

    it('should return a 200 status in the response', async () => {
      await sut.getUser(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a user id, name, email, englishLevel, technicalKnowledge, cvLink and role in the response body', async () => {
      await sut.getUser(req, res, next);
      const body = res._getJSONData();
      expect(Object.keys(body)).toEqual([
        'id',
        'name',
        'email',
        'englishLevel',
        'technicalKnowledge',
        'cvLink',
        'role',
      ]);
      expect(typeof body.role).toBe('string');
      expect(body).not.toHaveProperty('password');
    });

    it('should call next with BadRequestException if the user not exist', async () => {
      req.param.id = -1;
      mockUserModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.getUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if something went wrong', async () => {
      mockUserModel.findByPk = jest.fn().mockRejectedValueOnce(new Error());
      await sut.getUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Delete User', () => {
    let destroy;

    beforeEach(() => {
      destroy = jest.fn();
      mockUserModel.findByPk = jest
        .fn()
        .mockReturnValueOnce({ ...resolvedUser, destroy });
    });

    it('should have a deleteUser function', () => {
      expect(typeof sut.deleteUser).toBe('function');
    });

    it('should call User.findByPk with req.params.id and include object and then call the destroy method', async () => {
      await sut.deleteUser(req, res, next);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
        include: 'role',
      });
      expect(destroy).toHaveBeenCalled();
    });

    it('should response 200 if the user is deleted', async () => {
      await sut.deleteUser(req, res, next);
      expect(res.statusCode).toBe(204);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with BadRequestException if the user not exist', async () => {
      mockUserModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.deleteUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if something went wrong', async () => {
      mockUserModel.findByPk = jest.fn().mockRejectedValue(new Error());
      await sut.deleteUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });

    it('should call next with UnauthorizedException if the user is SuperAdmin', async () => {
      mockUserModel.findByPk = jest.fn().mockResolvedValueOnce({
        ...resolvedUser,
        role: { id: 1, name: 'SuperAdmin' },
      });
      await sut.deleteUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new ForbiddenException());
    });
  });

  describe('Update User', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      mockUserModel.findByPk = jest.fn().mockResolvedValueOnce({
        ...resolvedUser,
        save,
        role: { id: 1, name: 'TestRole' },
      });
    });

    it('should have a updateUser function', () => {
      expect(typeof sut.updateUser).toBe('function');
    });

    it('should call User.findByPk with req.params.id and include object as second argument', async () => {
      await sut.updateUser(req, res, next);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
        include: 'role',
      });
    });

    it('should call the save method to update the user', async () => {
      await sut.updateUser(req, res, next);
      expect(save).toHaveBeenCalledTimes(1);
    });

    it('should return 200 in the response object', async () => {
      await sut.updateUser(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it.each`
      field                   | newValue                            | expectedValue
      ${'name'}               | ${'updatedName'}                    | ${'updatedName'}
      ${'name'}               | ${null}                             | ${resolvedUser.name}
      ${'englishLevel'}       | ${'C2'}                             | ${'C2'}
      ${'englishLevel'}       | ${null}                             | ${resolvedUser.englishLevel}
      ${'cvLink'}             | ${'www.updatedUrl.com'}             | ${'www.updatedUrl.com'}
      ${'cvLink'}             | ${null}                             | ${resolvedUser.cvLink}
      ${'technicalKnowledge'} | ${'TechnicalKnowledge was updated'} | ${'TechnicalKnowledge was updated'}
      ${'technicalKnowledge'} | ${null}                             | ${resolvedUser.technicalKnowledge}
    `(
      'returns the user updated with the $field equals to $newValue',
      async ({ field, newValue, expectedValue }) => {
        req.body[field] = newValue;
        await sut.updateUser(req, res, next);
        const body = res._getJSONData();
        expect(body[field]).toBe(expectedValue);
      }
    );

    it('should update just the fields with not null values in req.body', async () => {
      req.body = {
        name: 'This field must be updated',
        englishLevel: '',
        cvLink: undefined,
        technicalKnowledge: null,
      };
      await sut.updateUser(req, res, next);
      const body = res._getJSONData();
      expect(body.name).not.toBe(resolvedUser.name);
      expect(body.name).toBe('This field must be updated');
      expect(body.englishLevel).toBe(resolvedUser.englishLevel);
      expect(body.cvLink).toBe(resolvedUser.cvLink);
      expect(body.technicalKnowledge).toBe(resolvedUser.technicalKnowledge);
    });

    it('should not update the email even if it is in the req.body', async () => {
      req.body.email = 'updatedemail@mail.com';
      await sut.updateUser(req, res, next);
      const email = res._getJSONData().email;
      expect(email).not.toBe('updatedmail@mail.com');
      expect(email).toBe(resolvedUser.email);
    });

    it('should return the user id, name, email, englishLevel, technicalKnowledge, cvLink and role in the response body', async () => {
      await sut.updateUser(req, res, next);
      const body = res._getJSONData();
      expect(Object.keys(body)).toEqual([
        'id',
        'name',
        'email',
        'englishLevel',
        'technicalKnowledge',
        'cvLink',
        'role',
      ]);
      expect(body).not.toHaveProperty('password');
    });

    it('should call next with BadRequestException if id is invalid', async () => {
      req.params.id = '0';
      mockUserModel.findByPk = jest.fn().mockResolvedValueOnce(null);
      await sut.updateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if something strange happen', async () => {
      mockUserModel.findByPk = jest.fn().mockRejectedValueOnce(new Error());
      await sut.updateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('LogOut User', () => {
    beforeEach(() => {
      req.headers.authorization = `Bearer 3434`;
    });

    it('should have a logOut function', () => {
      expect(typeof sut.logOut).toBe('function');
    });

    it('should call Token.findOne using the req.headers token', async () => {
      await sut.logOut(req, res, next);
      expect(mockTokenModel.findOne).toHaveBeenCalledWith({
        where: { token: '3434' },
      });
    });

    it('should call destroy if the token is returned by findOne', async () => {
      await sut.logOut(req, res, next);
      expect(mockTokenModel.destroy).toHaveBeenCalledWith();
    });

    it('should return 200 - OK if the token is deleted', async () => {
      await sut.logOut(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with APIException if an error happen', async () => {
      mockTokenModel.findOne.mockRejectedValueOnce(new Error());
      await sut.logOut(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });
});

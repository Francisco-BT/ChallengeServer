const { createResponse } = require('node-mocks-http');
const { RoleController, BaseController } = require('../../../src/controllers');
const { APIException } = require('../../../src/utils/errors');

describe.only('Role Controller Class', () => {
  it('should create new role controller instance', () => {
    const sut = new RoleController();
    expect(sut instanceof RoleController).toBeTruthy();
  });

  it('must be a instance of BaseController', () => {
    const sut = new RoleController();
    expect(sut instanceof BaseController).toBeTruthy();
  });

  describe('GET ROLES', () => {
    let sut, mockRoleModel, res;

    beforeEach(() => {
      res = createResponse();
      mockRoleModel = {
        findAll: jest.fn().mockReturnValue([
          { id: 1, name: 'GOD' },
          { id: 2, name: 'ADMIN', description: 'Admin role' },
        ]),
      };
      sut = new RoleController(mockRoleModel);
    });

    it('should have a getRoles method', () => {
      expect(sut.getRoles).toBeDefined();
      expect(typeof sut.getRoles).toBe('function');
    });

    it(`should called Role.findAll() when it's invoked`, () => {
      sut.getRoles(null, res);
      expect(mockRoleModel.findAll).toHaveBeenCalled();
    });

    it('should calls Role.findAll with a select operator', () => {
      sut.getRoles(null, res);
      expect(mockRoleModel.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'description'],
      });
    });

    it('should returns 200 OK in the response', async () => {
      await sut.getRoles(null, res);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should returns a list of roles in the response body', async () => {
      await sut.getRoles(null, res);
      const roles = res._getJSONData();
      expect(Array.isArray(roles)).toBeTruthy();
      expect(roles).toHaveLength(2);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should called next with APIError when fail', async () => {
      const mockModel = {
        findAll: jest
          .fn()
          .mockRejectedValue(new Error('Something went wrong!')),
      };
      sut = new RoleController(mockModel);
      const next = jest.fn();
      await sut.getRoles(null, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        new APIException('Error getting list of roles')
      );
    });
  });
});

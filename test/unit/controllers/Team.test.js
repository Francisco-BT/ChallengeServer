const { createRequest, createResponse } = require('node-mocks-http');
const { TeamController } = require('../../../src/controllers');
const {
  BadRequestException,
  APIException,
} = require('../../../src/utils/errors');

describe('TeamController', () => {
  let sut, req, res, next;

  const TeamMockModel = {
    bulkCreate: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    sut = new TeamController(TeamMockModel);
  });

  describe('Create Team', () => {
    beforeEach(() => {
      req.body = {
        accountId: 1,
        members: [1, 2],
      };
    });

    it('should have a create team function', () => {
      expect(typeof sut.createTeam).toBe('function');
    });

    it('should call Team.bulkCreate', async () => {
      await sut.createTeam(req, res, next);
      expect(TeamMockModel.bulkCreate).toHaveBeenCalled();
    });

    it('should call Team.bulkCreate with an array of members(users) and a account id', async () => {
      await sut.createTeam(req, res, next);
      expect(TeamMockModel.bulkCreate).toHaveBeenCalledWith([
        { accountId: 1, userId: 1 },
        { accountId: 1, userId: 2 },
      ]);
    });

    it('should response 201 on success', async () => {
      await sut.createTeam(req, res, next);
      expect(res.statusCode).toEqual(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with BadRequestException if bulkCreate fails with SequelizeForeignKeyConstraintError', async () => {
      TeamMockModel.bulkCreate = jest.fn().mockRejectedValueOnce({
        name: 'SequelizeForeignKeyConstraintError',
      });
      await sut.createTeam(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if bulkCreate fails for other reason', async () => {
      TeamMockModel.bulkCreate = jest.fn().mockRejectedValueOnce(new Error());
      await sut.createTeam(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Delete Team Member', () => {
    let destroy;
    beforeEach(() => {
      destroy = jest.fn();
      TeamMockModel.findOne = jest.fn().mockResolvedValueOnce({
        destroy,
      });
      req.params = { accountId: '1', userId: '1' };
    });

    it('should have a deleteTeamMember function', () => {
      expect(typeof sut.deleteTeamMember).toBe('function');
    });

    it('should call Team.findOne using accountId and userId', async () => {
      await sut.deleteTeamMember(req, res, next);
      expect(TeamMockModel.findOne).toHaveBeenCalledWith({
        where: { accountId: 1, userId: 1 },
      });
    });

    it('should call destroy to delete the entry', async () => {
      await sut.deleteTeamMember(req, res, next);
      expect(destroy).toHaveBeenCalled();
    });

    it('should response 204 if team member is soft deleted', async () => {
      await sut.deleteTeamMember(req, res, next);
      expect(res.statusCode).toBe(204);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with BadRequestException if team member not exists', async () => {
      TeamMockModel.findOne = jest.fn().mockResolvedValueOnce(null);
      await sut.deleteTeamMember(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if something went wrong', async () => {
      TeamMockModel.findOne = jest.fn().mockRejectedValueOnce(new Error());
      await sut.deleteTeamMember(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });
});

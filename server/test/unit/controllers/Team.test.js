const Sequelize = require('sequelize');
const { Op } = require('sequelize');
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
    create: jest.fn(),
  };
  const TeamMovementMockModel = {
    findAndCountAll: jest.fn(),
  };

  beforeEach(() => {
    TeamMockModel.findOne.mockClear();
    req = createRequest();
    res = createResponse();
    next = jest.fn();
    sut = new TeamController(TeamMockModel, TeamMovementMockModel);
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

  describe('Update Team Member', () => {
    let destroy;
    beforeEach(() => {
      req.params = { accountId: '1', userId: '1' };
      destroy = jest.fn();
      TeamMockModel.findOne = jest.fn().mockResolvedValueOnce({ destroy });
    });

    it('should have an updateTeamMember function', () => {
      expect(typeof sut.updateTeamMember).toBe('function');
    });

    it('should call Team.findOne using accountId and userId from req.params', async () => {
      await sut.updateTeamMember(req, res, next);
      expect(TeamMockModel.findOne).toHaveBeenCalledWith({
        where: {
          userId: 1,
          accountId: 1,
        },
      });
    });

    it('should call TeamMovement.destroy and TeamMockModel.create to update the account associated to the team member', async () => {
      req.body.newAccountId = 3;
      TeamMockModel.create = jest.fn();
      await sut.updateTeamMember(req, res, next);
      expect(destroy).toHaveBeenCalled();
      expect(TeamMockModel.create).toHaveBeenCalledWith({
        userId: 1,
        accountId: 3,
      });
    });

    it('should response 200 OK on success', async () => {
      await sut.updateTeamMember(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call next with BadRequestException if create throws a SequelizeForeignKeyConstraintError', async () => {
      TeamMockModel.create = jest.fn().mockRejectedValueOnce({
        name: 'SequelizeForeignKeyConstraintError',
      });
      await sut.updateTeamMember(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });

    it('should call next with APIException if something went wrong', async () => {
      TeamMockModel.findOne = jest.fn().mockRejectedValueOnce(new Error());
      await sut.updateTeamMember(req, res, next);
      expect(next).toHaveBeenCalledWith(new APIException());
    });
  });

  describe('Get Team Members Movements', () => {
    beforeEach(() => {
      TeamMovementMockModel.findAndCountAll.mockClear();
      TeamMovementMockModel.findAndCountAll = jest.fn().mockResolvedValueOnce({
        rows: [],
        count: 0,
      });
    });

    it('should have getTeamMovements function', () => {
      expect(typeof sut.getTeamMovements).toBe('function');
    });

    it('should call TeamMovement.findAndCountAll', async () => {
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should call TeamMovement.findAndCount order by id DESC', async () => {
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['id', 'DESC']] })
      );
    });

    it('should call TeamMovement.findAndCount with limit 30 and offset 0 is are not provided in req.query', async () => {
      req.query = {};
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 30, offset: 0 })
      );
    });

    it('should call TeamMovement.findAndCountAll with valid limit and offset if page and limit are in the req.query', async () => {
      req.query = { limit: 40, page: 2 };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 40, offset: 40 })
      );
    });

    it('should call TeamMovement.findAndCountAll with userName using like search', async () => {
      req.query = { userName: 'TestFilter' };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { [Op.and]: [{ userName: { [Op.like]: 'TestFilter%' } }] },
        })
      );
    });

    it('should call TeamMovements.findAndCountAll with accountName using like search', async () => {
      req.query = { accountName: 'TestAccountFilter' };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [{ accountName: { [Op.like]: 'TestAccountFilter%' } }],
          },
        })
      );
    });

    it('should call TeamMovements.findAndCountAll with greater or equal than startDate', async () => {
      req.query = { startDate: '2021-09-22' };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('date', Sequelize.col('startDate')),
                {
                  [Op.gte]: '2021-09-22',
                }
              ),
            ],
          },
        })
      );
    });

    it('should call TeamMovements.findAndCountAll with greater than or equal to endDate if startDate is not provided', async () => {
      req.query = { endDate: '2021-09-23' };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('date', Sequelize.col('endDate')), {
                [Op.gte]: '2021-09-23',
              }),
            ],
          },
        })
      );
    });

    it('should call TeamMovement.findAndCountAll with gte startDate and lte endDate if both exist', async () => {
      req.query = { startDate: '2021-09-22', endDate: '2021-09-23' };
      await sut.getTeamMovements(req, res, next);
      expect(TeamMovementMockModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('date', Sequelize.col('startDate')),
                {
                  [Op.gte]: '2021-09-22',
                }
              ),
              Sequelize.where(Sequelize.fn('date', Sequelize.col('endDate')), {
                [Op.lte]: '2021-09-23',
              }),
            ],
          },
        })
      );
    });

    it('should response 200 on success', async () => {
      await sut.getTeamMovements(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return items in the response', async () => {
      await sut.getTeamMovements(req, res, next);
      expect(res._getJSONData()).toHaveProperty('items');
      expect(res._getJSONData().items).toHaveLength(0);
    });

    it('should return pagination object in the response', async () => {
      await sut.getTeamMovements(req, res, next);
      const pagination = res._getJSONData().pagination;
      expect(pagination).toBeDefined();
      expect(Object.keys(pagination)).toEqual([
        'totalPages',
        'limit',
        'hasNext',
        'hasPrevious',
        'currentPage',
      ]);
    });

    it('should call next with BadRequestException if something went wrong', async () => {
      TeamMovementMockModel.findAndCountAll = jest
        .fn()
        .mockRejectedValueOnce(new Error());
      await sut.getTeamMovements(req, res, next);
      expect(next).toHaveBeenCalledWith(new BadRequestException());
    });
  });
});

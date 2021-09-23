const { Op } = require('sequelize');
const BaseController = require('./BaseController');
const { BadRequestException, APIException } = require('../utils/errors');
const { paginationBoundaries, buildPagination } = require('../utils');
const {
  TEAM_MOVEMENTS_LOG_DEFAULT_ITEMS_PER_PAGE,
  TEAM_MOVEMENTS_LOG_MAX_LIMIT_PER_PAGE,
} = require('../config');

class TeamController extends BaseController {
  constructor(model, TeamMovementModel) {
    super(model);
    this.TeamMovement = TeamMovementModel;
  }

  async createTeam(req, res, next) {
    try {
      const { accountId, members } = req.body;
      await this._sequelizeModel.bulkCreate([
        ...members.map((member) => ({
          userId: member,
          accountId,
        })),
      ]);
      res.sendStatus(201);
    } catch (err) {
      if (err.name && err.name === 'SequelizeForeignKeyConstraintError') {
        return next(new BadRequestException());
      }
      next(new APIException());
    }
  }

  async deleteTeamMember(req, res, next) {
    try {
      const { accountId, userId } = req.params;
      const teamMember = await this._sequelizeModel.findOne({
        where: {
          accountId: parseInt(accountId, 10),
          userId: parseInt(userId, 10),
        },
      });

      if (teamMember) {
        await teamMember.destroy();
        return res.sendStatus(204);
      }
      next(new BadRequestException());
    } catch (error) {
      next(new APIException());
    }
  }

  async updateTeamMember(req, res, next) {
    try {
      const { newAccountId } = req.body;
      const accountId = parseInt(req.params.accountId, 10);
      const userId = parseInt(req.params.userId, 10);

      const teamMember = await this._sequelizeModel.findOne({
        where: { accountId, userId },
      });

      if (teamMember) {
        await this._sequelizeModel.create({
          userId,
          accountId: parseInt(newAccountId, 10),
        });
        await teamMember.destroy();
        return res.sendStatus(200);
      }
      next(new BadRequestException());
    } catch (err) {
      if (err.name && err.name === 'SequelizeForeignKeyConstraintError') {
        return next(new BadRequestException());
      }
      next(new APIException());
    }
  }

  async getTeamMovements(req, res, next) {
    try {
      const { userName, accountName, startDate, endDate } = req.query;
      const { limit, offset, page } = paginationBoundaries({
        ...req.query,
        defaultLimit: TEAM_MOVEMENTS_LOG_DEFAULT_ITEMS_PER_PAGE,
        maxLimit: TEAM_MOVEMENTS_LOG_MAX_LIMIT_PER_PAGE,
      });

      const filters = {};

      if (userName) {
        filters.userName = String(userName);
      }

      if (accountName) {
        filters.accountName = String(accountName);
      }

      if (startDate) {
        filters.startDate = { [Op.gte]: startDate };
      }

      if (endDate) {
        filters.endDate = { [startDate ? Op.lte : Op.gte]: endDate };
      }

      const { rows, count } = await this.TeamMovement.findAndCountAll({
        order: [['id', 'DESC']],
        limit,
        offset,
        where: { ...filters },
      });
      res.status(200).json({
        items: rows,
        pagination: buildPagination({ count, limit, page }),
      });
    } catch {
      next(new BadRequestException());
    }
  }
}

module.exports = TeamController;

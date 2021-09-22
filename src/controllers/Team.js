const BaseController = require('./BaseController');
const { BadRequestException, APIException } = require('../utils/errors');

class TeamController extends BaseController {
  constructor(model) {
    super(model);
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
}

module.exports = TeamController;

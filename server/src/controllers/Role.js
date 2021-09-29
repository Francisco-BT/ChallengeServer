const { Op } = require('sequelize');
const BaseController = require('./BaseController');
const { APIException } = require('../utils/errors');

class RoleController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getRoles(req, res, next) {
    try {
      const roles = await this._sequelizeModel.findAll({
        attributes: ['id', 'name', 'description'],
        where: { name: { [Op.not]: 'SuperAdmin' } },
      });
      res.status(200).json(roles);
    } catch (error) {
      next(new APIException('Error getting list of roles'));
    }
  }
}

module.exports = RoleController;

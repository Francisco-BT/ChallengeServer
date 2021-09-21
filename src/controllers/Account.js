const BaseController = require('./BaseController');
const { APIException, BadRequestException } = require('../utils/errors');
const {
  paginationBoundaries,
  buildPagination,
  pickValue,
} = require('../utils');

class AccountController extends BaseController {
  constructor(model) {
    super(model);
  }

  async create(req, res, next) {
    try {
      const account = await this._sequelizeModel.create({ ...req.body });
      res.status(201).json(AccountController.parseAccount(account));
    } catch {
      next(new APIException());
    }
  }

  async getAll(req, res, next) {
    try {
      const { limit, offset, page } = paginationBoundaries(req.query);
      const { count, rows } = await this._sequelizeModel.findAndCountAll({
        limit,
        offset,
      });
      res.status(200).json({
        items: rows.map((row) => AccountController.parseAccount(row)),
        pagination: buildPagination({ totalItems: count, limit, page }),
      });
    } catch {
      next(new APIException());
    }
  }

  async getAccount(req, res, next) {
    try {
      const { id } = req.params;
      const account = await this._sequelizeModel.findByPk(parseInt(id, 10));
      if (account) {
        return res.status(200).json(AccountController.parseAccount(account));
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const { id } = req.params;
      const account = await this._sequelizeModel.findByPk(parseInt(id, 10));

      if (account) {
        await account.destroy();
        return res.sendStatus(204);
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async updateAccount(req, res, next) {
    try {
      const { id } = req.params;
      const { name, clientName, responsibleName } = req.body;
      const account = await this._sequelizeModel.findByPk(parseInt(id, 10));

      if (account) {
        await account.save();
        account.name = pickValue(name, account.name);
        account.clientName = pickValue(clientName, account.clientName);
        account.responsibleName = pickValue(
          responsibleName,
          account.responsibleName
        );
        res.status(200).json(account);
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  static parseAccount(account) {
    return {
      id: account.id,
      name: account.name,
      clientName: account.clientName,
      responsibleName: account.responsibleName,
    };
  }
}

module.exports = AccountController;

const BaseController = require('./BaseController');
const {
  APIException,
  BadRequestException,
  ConflictException,
} = require('../utils/errors');
const {
  paginationBoundaries,
  buildPagination,
  pickValue,
} = require('../utils');
const { User } = require('../models');

class AccountController extends BaseController {
  constructor(model) {
    super(model);
  }

  async create(req, res, next) {
    try {
      const { name, clientName, responsibleName } = req.body;
      const accountExist = await this._sequelizeModel.findOne({
        where: { name },
      });

      if (accountExist) {
        return next(new ConflictException());
      }

      const account = await this._sequelizeModel.create({
        name,
        clientName,
        responsibleName,
      });
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
      const account = await this._sequelizeModel.findByPk(parseInt(id, 10), {
        include: [
          {
            model: User,
            as: 'team',
            attributes: ['id', 'name', 'email'],
            through: { attributes: [] },
          },
        ],
      });
      if (account) {
        return res.status(200).json({
          ...AccountController.parseAccount(account),
          team: account.team,
        });
      }
      next(new BadRequestException());
    } catch (e) {
      console.log('Error: ', e);
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
        account.name = pickValue(name, account.name);
        account.clientName = pickValue(clientName, account.clientName);
        account.responsibleName = pickValue(
          responsibleName,
          account.responsibleName
        );
        await account.save();
        return res.status(200).json(account);
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

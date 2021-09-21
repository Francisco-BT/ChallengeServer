const BaseController = require('./BaseController');
const { APIException } = require('../utils/errors');

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

  static parseAccount(account) {
    return {
      id: account.id,
      name: account.name,
      clientName: account.clientName,
      responsibleName: account.responsible,
    };
  }
}

module.exports = AccountController;

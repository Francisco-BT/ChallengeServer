const BaseController = require('./BaseController');
const { encrypt } = require('../utils');
const { APIException } = require('../utils/errors');

class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  async create(req, res, next) {
    try {
      const encryptedPassword = await encrypt(req.body.password);
      const user = await this._sequelizeModel.create({
        ...req.body,
        password: encryptedPassword,
      });
      res.status(201).json({ ...this.parseUser(user) });
    } catch {
      next(new APIException());
    }
  }

  async getAll(_, res, next) {
    try {
      const users = await this._sequelizeModel.findAll();
      res.status(200).json(users.map((user) => this.parseUser(user)));
    } catch {
      next(new APIException());
    }
  }

  parseUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      englishLevel: user.englishLevel,
      technicalKnowledge: user.technicalKnowledge,
      cvLink: user.cvLink,
    };
  }
}

module.exports = UserController;

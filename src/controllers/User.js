const BaseController = require('./BaseController');
const { encrypt, compareEncrypted, generateToken } = require('../utils');
const { APIException, AuthenticationException } = require('../utils/errors');

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

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this._sequelizeModel.findOne({ where: { email } });

      if (user) {
        const isValidPassword = await compareEncrypted(password, user.password);
        if (isValidPassword) {
          return res.status(200).json({
            id: user.id,
            name: user.name,
            token: generateToken({ id: user.id }),
          });
        }
      }
      next(new AuthenticationException());
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

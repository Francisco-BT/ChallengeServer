const BaseController = require('./BaseController');
const { encrypt, compareEncrypted, generateToken } = require('../utils');
const {
  APIException,
  AuthenticationException,
  ValidationsException,
  BadRequestException,
  ForbiddenException,
} = require('../utils/errors');
const { getTokenFromHeaders } = require('../utils');

class UserController extends BaseController {
  constructor(model, RoleModel, TokenModel) {
    super(model);
    this.RoleModel = RoleModel;
    this.TokenModel = TokenModel;
  }

  async create(req, res, next) {
    const { roleId, password } = req.body;
    try {
      const role = await this.RoleModel.findByPk(roleId);
      if (!role || role.name === 'SuperAdmin') {
        return next(new ValidationsException({ roleId: 'Role is not valid' }));
      }

      const encryptedPassword = await encrypt(password);
      const user = await this._sequelizeModel.create({
        ...req.body,
        password: encryptedPassword,
      });
      const userRole = await user.getRole();
      res.status(201).json({ ...UserController.parseUser(user, userRole) });
    } catch {
      next(new APIException());
    }
  }

  async getAll(_, res, next) {
    try {
      const users = await this._sequelizeModel.findAll();
      res.status(200).json(users.map((user) => UserController.parseUser(user)));
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
            token: await generateToken({ id: user.id }),
          });
        }
      }
      next(new AuthenticationException());
    } catch {
      next(new APIException());
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.findUserById(id, { include: 'role' });
      if (user) {
        return res
          .status(200)
          .json({ ...UserController.parseUser(user, user.role) });
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.findUserById(id, { include: 'role' });

      if (user) {
        if (user.role.name === 'SuperAdmin') {
          return next(new ForbiddenException());
        }

        await user.destroy();
        return res.sendStatus(204);
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, englishLevel, cvLink, technicalKnowledge } = req.body;

      const user = await this.findUserById(id, { include: 'role' });
      if (user) {
        user.name = this.pickValue(name, user.name);
        user.englishLevel = this.pickValue(englishLevel, user.englishLevel);
        user.cvLink = this.pickValue(cvLink, user.cvLink);
        user.technicalKnowledge = this.pickValue(
          technicalKnowledge,
          user.technicalKnowledge
        );
        await user.save();
        res.status(200).json({ ...UserController.parseUser(user, user.role) });
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async logOut(req, res, next) {
    try {
      const rawToken = getTokenFromHeaders(req);
      const tokenInDb = await this.TokenModel.findOne({
        where: { token: rawToken },
      });
      await tokenInDb.destroy();
      res.sendStatus(200);
    } catch {
      next(new APIException());
    }
  }

  pickValue(option1, option2) {
    return option1 ? option1 : option2;
  }

  static parseUser(user, role) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      englishLevel: user.englishLevel,
      technicalKnowledge: user.technicalKnowledge,
      cvLink: user.cvLink,
      role: role ? role.name : undefined,
    };
  }

  async findUserById(id, options = {}) {
    return await this._sequelizeModel.findByPk(parseInt(id, 10), options);
  }
}

module.exports = UserController;

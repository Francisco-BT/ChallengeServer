const BaseController = require('./BaseController');
const { encrypt, compareEncrypted, generateToken } = require('../utils');
const {
  APIException,
  AuthenticationException,
  ValidationsException,
  BadRequestException,
} = require('../utils/errors');

class UserController extends BaseController {
  constructor(model, RoleModel) {
    super(model);
    this.RoleModel = RoleModel;
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
      res.status(201).json({ ...this.parseUser(user), role: userRole.name });
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

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this._sequelizeModel.findByPk(parseInt(id, 10), {
        include: 'role',
      });

      if (user) {
        return res
          .status(200)
          .json({ ...this.parseUser(user), role: user.role.name });
      }
      next(new BadRequestException());
    } catch {
      next(new APIException());
    }
  }

  async deleteUser(req, res, next) {
    try {
      const user = await this._sequelizeModel.findByPk(req.params.id);
      if (user) {
        await user.destroy();
        return res.sendStatus(204);
      }
      next(new BadRequestException());
    } catch {
      next(new APIException())
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

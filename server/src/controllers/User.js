const BaseController = require('./BaseController');
const { encrypt, compareEncrypted, generateToken } = require('../utils');
const {
  APIException,
  AuthenticationException,
  ValidationsException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} = require('../utils/errors');
const {
  getTokenFromHeaders,
  pickValue,
  buildPagination,
  paginationBoundaries,
} = require('../utils');

class UserController extends BaseController {
  constructor(model, RoleModel, TokenModel) {
    super(model);
    this.RoleModel = RoleModel;
    this.TokenModel = TokenModel;
  }

  async create(req, res, next) {
    const { roleId, password, email } = req.body;
    try {
      const role = await this.RoleModel.findByPk(roleId);
      if (!role || role.name === 'SuperAdmin') {
        return next(new ValidationsException({ roleId: 'Role is not valid' }));
      }

      const userExists = await this._sequelizeModel.findOne({
        where: { email },
      });

      if (userExists) {
        return next(new ConflictException());
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

  async getAll(req, res, next) {
    try {
      const { page, limit, offset } = paginationBoundaries({
        page: req.query.page,
        limit: req.query.limit,
      });
      const { count, rows } = await this._sequelizeModel.findAndCountAll({
        limit,
        offset,
      });
      res.status(200).json({
        items: rows.map((user) => UserController.parseUser(user)),
        pagination: buildPagination({ totalItems: count, limit, page }),
      });
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
          const token = await generateToken({ id: user.id }, this.TokenModel);
          return res.status(200).json({
            id: user.id,
            name: user.name,
            token,
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
      if (parseInt(id, 10) !== req.user.id && req.user.role === 'Normal') {
        return next(new ForbiddenException());
      }

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
        user.name = pickValue(name, user.name);
        user.englishLevel = pickValue(englishLevel, user.englishLevel);
        user.cvLink = pickValue(cvLink, user.cvLink);
        user.technicalKnowledge = pickValue(
          technicalKnowledge,
          user.technicalKnowledge
        );
        await user.save();
        return res
          .status(200)
          .json({ ...UserController.parseUser(user, user.role) });
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

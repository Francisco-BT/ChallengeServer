const BaseController = require('./BaseController');
const { encrypt } = require('../utils');

class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  async create(req, res) {
    const encryptedPassword = await encrypt(req.body.password);
    const user = await this._sequelizeModel.create({
      ...req.body,
      password: encryptedPassword,
    });

    res.status(201).json({ ...this.parseUser(user) });
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

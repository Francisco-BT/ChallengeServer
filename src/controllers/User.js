const BaseController = require('./BaseController');

class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  async create(req, res) {
    const user = await this._sequelizeModel.create(req.body);

    res.status(201).json({ ...user, password: undefined });
  }
}

module.exports = UserController;

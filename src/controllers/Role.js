const BaseController = require('./BaseController');

class RoleController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getRoles(req, res) {
    try {
      const roles = await this._sequelizeModel.findAll({
        attributes: ['id', 'name', 'description'],
      });
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).send({ message: 'Error getting list of roles' });
    }
  }
}

module.exports = RoleController;

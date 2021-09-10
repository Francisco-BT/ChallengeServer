const BaseController = require('./BaseController');

class RoleController extends BaseController {
	constructor(model) {
		super(model);
	}

	async getRoles(req, res) {
		try {
			const roles = await this._sequelizeModel.findAll();
			res.status(200).json(roles);
		} catch {
			res.status(500).send({ message: 'Error getting list of roles' });
		}
	}
}

module.exports = RoleController;

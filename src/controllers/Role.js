const BaseController = require('./BaseController');

class RoleController extends BaseController {
	constructor(model) {
		super(model);
	}

	async getRoles(req, res) {
		const roles = await this._sequelizeModel.findAll();
		res.status(200).json(roles);
	}
}

module.exports = RoleController;

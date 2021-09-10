class BaseController {
	constructor(sequelizeModel) {
		this._sequelizeModel = sequelizeModel;
	}
}

module.exports = BaseController;

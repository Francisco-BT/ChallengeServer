const { Router } = require('express');
const routerV1 = Router();
const baseUrl = '/api/v1';

routerV1.use(`/roles`, require('./roles')(routerV1));

module.exports = {
	router: routerV1,
	path: baseUrl,
};

const { Router } = require('express');
const routerV1 = Router();
const baseUrl = '/api/v1';

routerV1.use('/roles', require('./roles')(Router()));
routerV1.use('/users', require('./users')(Router()));
routerV1.use('/accounts', require('./accounts')(Router()));
routerV1.use('/teams', require('./teams')(Router()));

module.exports = {
  router: routerV1,
  path: baseUrl,
};

const { Router } = require('express');
const routerV1 = Router();
const baseUrl = '/api/v1';

routerV1.use(`/roles`, require('./roles')(Router()));
routerV1.use('/users', require('./users')(Router()));

module.exports = {
  router: routerV1,
  path: baseUrl,
};

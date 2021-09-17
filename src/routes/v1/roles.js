const { Role } = require('../../models');
const { RoleController } = require('../../controllers');

const controller = new RoleController(Role);
module.exports = (router) => {
  router.get('/', (req, res, next) => controller.getRoles(req, res, next));

  return router;
};

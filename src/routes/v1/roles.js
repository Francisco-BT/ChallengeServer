const { Role } = require('../../models');
const { RoleController } = require('../../controllers');
const { tokenAuthorization } = require('../../middlewares');

const controller = new RoleController(Role);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.get('/', (req, res, next) => controller.getRoles(req, res, next));

  return router;
};

const { Role } = require('../../models');
const { RoleController } = require('../../controllers');
const { tokenAuthorization, roleAuthorization } = require('../../middlewares');

const controller = new RoleController(Role);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));
  router.get('/', (req, res, next) => controller.getRoles(req, res, next));

  return router;
};

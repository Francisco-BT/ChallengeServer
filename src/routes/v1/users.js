const { UserController } = require('../../controllers');
const { User } = require('../../models');

const controller = new UserController(User);
module.exports = (router) => {
  router.post('/', (req, res) => controller.create(req, res));

  return router;
};

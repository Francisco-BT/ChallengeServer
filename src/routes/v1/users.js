const { UserController } = require('../../controllers');
const { User } = require('../../models');
const { newUserValidator } = require('../../middlewares');

const controller = new UserController(User);
module.exports = (router) => {
  router.post('/', newUserValidator(), (req, res, next) =>
    controller.create(req, res, next)
  );

  router.get('/', (req, res, next) => controller.getAll(req, res, next));

  return router;
};

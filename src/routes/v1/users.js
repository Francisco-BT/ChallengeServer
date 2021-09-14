const { UserController } = require('../../controllers');
const { User } = require('../../models');
const { newUserValidator } = require('../../middlewares');

const controller = new UserController(User);
module.exports = (router) => {
  router.post('/', newUserValidator(), (req, res) =>
    controller.create(req, res)
  );

  return router;
};

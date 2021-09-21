const { Account } = require('../../models');
const { AccountController } = require('../../controllers');
const {
  tokenAuthorization,
  roleAuthorization,
  newAccountValidator,
} = require('../../middlewares');

const controller = new AccountController(Account);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));
  router.post('/', newAccountValidator(), (req, res, next) =>
    controller.create(req, res, next)
  );

  return router;
};

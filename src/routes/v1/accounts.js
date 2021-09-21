const { Account } = require('../../models');
const { AccountController } = require('../../controllers');
const {
  tokenAuthorization,
  roleAuthorization,
  newAccountValidator,
  updateAccountValidator,
} = require('../../middlewares');

const controller = new AccountController(Account);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));
  router.post('/', newAccountValidator(), (req, res, next) =>
    controller.create(req, res, next)
  );
  router.put('/:id', updateAccountValidator(), (req, res, next) =>
    controller.updateAccount(req, res, next)
  );
  router.delete('/:id', (req, res, next) =>
    controller.deleteAccount(req, res, next)
  );
  router.get('/:id', (req, res, next) => controller.getAccount(req, res, next));
  router.get('/', (req, res, next) => controller.getAll(req, res, next));
  return router;
};

const { UserController } = require('../../controllers');
const { User, Role, Token } = require('../../models');
const {
  newUserValidator,
  updateUserValidator,
  tokenAuthorization,
  roleAuthorization,
} = require('../../middlewares');

const controller = new UserController(User, Role, Token);
module.exports = (router) => {
  router.post('/auth', (req, res, next) =>
    controller.authenticate(req, res, next)
  );

  // Protected routes below this line
  router.use(tokenAuthorization());
  router.post('/logout', (req, res, next) => controller.logOut(req, res, next));
  router.get('/:id', (req, res, next) => controller.getUser(req, res, next));

  // Protect routes to be accessible by user with specific roles
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));
  router.post('/', newUserValidator(), (req, res, next) =>
    controller.create(req, res, next)
  );

  router.get('/', (req, res, next) => controller.getAll(req, res, next));

  router.delete('/:id', (req, res, next) =>
    controller.deleteUser(req, res, next)
  );

  router.put('/:id', updateUserValidator(), (req, res, next) =>
    controller.updateUser(req, res, next)
  );

  return router;
};

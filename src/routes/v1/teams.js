const { Team, TeamMovement } = require('../../models');
const { TeamController } = require('../../controllers');
const {
  tokenAuthorization,
  roleAuthorization,
  newTeamValidator,
} = require('../../middlewares');

const controller = new TeamController(Team, TeamMovement);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));

  router.post('/', newTeamValidator(), (req, res, next) =>
    controller.createTeam(req, res, next)
  );
  router.delete('/:accountId/:userId/', (req, res, next) =>
    controller.deleteTeamMember(req, res, next)
  );
  router.put('/:accountId/:userId', (req, res, next) =>
    controller.updateTeamMember(req, res, next)
  );
  router.get('/', (req, res, next) =>
    controller.getTeamMovements(req, res, next)
  );

  return router;
};

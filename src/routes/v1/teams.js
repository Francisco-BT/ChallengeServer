const { Team } = require('../../models');
const { TeamController } = require('../../controllers');
const {
  tokenAuthorization,
  roleAuthorization,
  newTeamValidator,
} = require('../../middlewares');

const controller = new TeamController(Team);
module.exports = (router) => {
  router.use(tokenAuthorization());
  router.use(roleAuthorization(['Admin', 'SuperAdmin']));

  router.post('/', newTeamValidator(), (req, res, next) =>
    controller.createTeam(req, res, next)
  );
  router.delete('/:accountId/:userId/', (req, res, next) =>
    controller.deleteTeamMember(req, res, next)
  );

  return router;
};

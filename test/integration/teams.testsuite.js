const {
  getAuthToken,
  createAccounts,
  createUsers,
  createTeam,
} = require('./utils');
const { Team } = require('../../src/models');

module.exports = (agent) => {
  let token;
  beforeEach(async () => {
    token = await getAuthToken(agent, 'SuperAdmin');
  });

  const postTeam = async (accountId, members, token) => {
    return await agent
      .post('/api/v1/teams')
      .send({
        accountId,
        members,
      })
      .auth(token, { type: 'bearer' });
  };

  describe('POST - /api/v1/teams', () => {
    it('should response 401 if no token is provided', async () => {
      const response = await postTeam(1, [], '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if token has role Normal', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await postTeam(1, [], normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should create a new Team responding 201', async () => {
      const members = await createUsers(2);
      const account = (await createAccounts(1))[0];
      const response = await postTeam(
        account.id,
        [...members.map((m) => m.id)],
        token
      );
      expect(response.status).toBe(201);
    });

    it('should response 400 if accountId and members not exist', async () => {
      const response = await postTeam(0, [0], token);
      expect(response.status).toBe(400);
    });

    it('should response validation errors in body if fields are missing', async () => {
      const response = await postTeam(null, '', token);
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.objectContaining({ accountId: 'Account ID cannot be null' }),
        expect.objectContaining({
          members: 'Members must be an array of user IDs',
        })
      );
    });
  });

  describe('DELETE - /api/v1/teams/:accountId/:userId', () => {
    const deleteMember = async (accountId, userId, token) => {
      return await agent
        .delete(`/api/v1/teams/${accountId}/${userId}`)
        .auth(token, { type: 'bearer' });
    };

    it('should response 401 if token is not provided', async () => {
      const response = await deleteMember(1, 1, '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if token has role Normal', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await deleteMember(1, 1, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 204 setting the isDelete and endDate fields', async () => {
      const team = await createTeam();
      const response = await deleteMember(team.accountId, team.userId, token);
      const teamMemberInDb = await Team.findOne({
        where: {
          accountId: team.accountId,
          userId: team.userId,
        },
      });
      expect(response.status).toBe(204);
      expect(teamMemberInDb).toBeNull();
    });

    it('should response 400 if userId is not valid', async () => {
      const team = await createTeam();
      const response = await deleteMember(team.accountId, 0, token);
      expect(response.status).toBe(400);
    });

    it('should response 400 if both accountId and userId are invalid', async () => {
      const response = await deleteMember(0, 0, token);
      expect(response.status).toBe(400);
    });
  });
};

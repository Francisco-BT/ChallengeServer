const { getAuthToken, createAccounts, createUsers } = require('./utils');

module.exports = (agent) => {
  let token;
  beforeEach(async () => {
    token = await getAuthToken(agent, 'SuperAdmin');
  });

  describe('POST - /api/v1/teams', () => {
    const postTeam = async (accountId, members, token) => {
      return await agent
        .post('/api/v1/teams')
        .send({
          accountId,
          members,
        })
        .auth(token, { type: 'bearer' });
    };

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
};

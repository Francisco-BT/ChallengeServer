const {
  getAuthToken,
  createAccounts,
  createUsers,
  createTeam,
  createTeams,
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

  describe('UPDATE - /api/v1/teams/:accountId/:userId', () => {
    const putTeamMember = async (accountId, userId, payload, token) => {
      return await agent
        .put(`/api/v1/teams/${accountId}/${userId}`)
        .send(payload)
        .auth(token, { type: 'bearer' });
    };

    it('should response 401 if token is not provided', async () => {
      const response = await putTeamMember(1, 1, {}, '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if the toke has role Normal', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await putTeamMember(1, 1, {}, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 200 if the team member was updated', async () => {
      const team = await createTeam();
      const account = (await createAccounts(1))[0];
      const response = await putTeamMember(
        team.accountId,
        team.userId,
        { newAccountId: account.id },
        token
      );
      const teamInDb = await Team.findOne({
        where: { userId: team.userId, accountId: account.id },
      });
      expect(response.status).toBe(200);
      expect(teamInDb.userId).toBe(team.userId);
      expect(teamInDb.accountId).toBe(account.id);
    });

    it('should response 400 if newAccountId is not valid', async () => {
      const team = await createTeam();
      const response = await putTeamMember(
        team.accountId,
        team.userId,
        { newAccountId: 0 },
        token
      );
      expect(response.status).toBe(400);
    });

    it('should response 400 if team member not exist', async () => {
      const response = await putTeamMember(0, 0, {}, token);
      expect(response.status).toBe(400);
    });
  });

  describe('GET - /api/v1/teams', () => {
    const getTeams = async (query, token) => {
      return await agent
        .get('/api/v1/teams')
        .query(query)
        .auth(token, { type: 'bearer' });
    };

    it('should response 401 if the tokes is not provided', async () => {
      const response = await getTeams({}, '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if token has role Normal', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await getTeams({}, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 200 with valid token', async () => {
      const response = await getTeams({}, token);
      expect(response.status).toBe(200);
    });

    it('should return an array of items', async () => {
      const response = await getTeams({}, token);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toHaveLength(0);
    });

    it('should return a pagination object in the response', async () => {
      const response = await getTeams({}, token);
      const pagination = response.body.pagination;
      expect(pagination).toBeDefined();
      expect(Object.keys(pagination)).toEqual([
        'totalPages',
        'limit',
        'hasNext',
        'hasPrevious',
        'currentPage',
      ]);
    });

    it('should return filtered data by userName and accountName', async () => {
      const { users, accounts } = await createTeams();
      const response = await getTeams(
        { userName: users[0].name, accountName: accounts[1].name },
        token
      );
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    it('should return filtered data by startDate and endDate', async () => {
      await createTeams();
      const today = new Date();
      const dayInMs = 60 * 60 * 24 * 1000;
      const yesterday = new Date(today.getTime() - dayInMs);
      const tomorrow = new Date(today.getTime() + dayInMs);
      const response = await getTeams(
        { startDate: yesterday, endDate: tomorrow },
        token
      );
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
    });

    it('should response empty data if startDate is in the future', async () => {
      await createTeams();
      const response = await getTeams(
        { startDate: '2021-09-30', endDate: '2021-09-22' },
        token
      );
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
    });

    it('should response 400 if a field value is invalid', async () => {
      const response = await getTeams(
        {
          startDate: 'This is not a valid date',
        },
        token
      );
      expect(response.status).toBe(400);
    });
  });
};

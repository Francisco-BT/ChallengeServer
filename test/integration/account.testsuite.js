const { Account } = require('../../src/models');
const { getAuthToken, createAccounts } = require('./utils');

module.exports = (agent) => {
  let token;

  beforeEach(async () => {
    await Account.sync({ force: true });
    token = await getAuthToken(agent, 'SuperAdmin');
  });

  describe('POST - /api/v1/accounts', () => {
    const validPayload = {
      name: 'AccountTest',
      clientName: 'ClientTest',
      responsibleName: 'ResponsibleTest',
    };

    const postAccount = async (payload, token) =>
      await agent
        .post('/api/v1/accounts')
        .auth(token, { type: 'bearer' })
        .send(payload);

    it('should response 401 if no token is provided', async () => {
      const response = await postAccount('');
      expect(response.status).toBe(401);
    });

    it('should response 403 if role is token role is Normal', async () => {
      const normalToken = await getAuthToken(agent, 'Normal');
      const response = await postAccount({}, normalToken);

      expect(response.status).toBe(403);
    });

    it('should response 201 if the account is created', async () => {
      const token = await getAuthToken(agent, 'Admin');
      const response = await postAccount(validPayload, token);
      expect(response.status).toBe(201);
    });

    it('should response id, name, clientName and responsible in the body', async () => {
      const response = await postAccount(validPayload, token);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toEqual(
        expect.objectContaining({ name: 'AccountTest' }),
        expect.objectContaining({ clientName: 'ClientTest' }),
        expect.objectContaining({ responsible: 'ResponsibleTest' })
      );
      expect(response.body).not.toHaveProperty('createdAt');
    });

    it('should response 400 with errors if the fields values are wrong', async () => {
      const response = await postAccount(
        { responsibleName: '13123123' },
        token
      );
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.objectContaining({ name: 'Name cannot be null' }),
        expect.objectContaining({ clientName: 'ClientName cannot be null' }),
        expect.objectContaining({
          responsibleName:
            'Responsible Name cannot contain number or special characters',
        })
      );
    });

    it('should response 409 if the account already exists', async () => {
      await postAccount(validPayload, token);
      const response = await postAccount(validPayload, token);
      expect(response.status).toBe(409);
      expect(Object.keys(response.body)).toEqual(['message', 'timestamp']);
    });
  });

  describe('PUT - /api/v1/accounts/:id', () => {
    const putAccount = async (id, payload, token) => {
      return await agent
        .put(`/api/v1/accounts/${id}`)
        .send(payload)
        .auth(token, { type: 'bearer' });
    };

    it('should response 200 if the account is updated', async () => {
      const account = (await createAccounts(1))[0];
      const response = await putAccount(
        account.id,
        { name: 'AccountNameUpdated' },
        token
      );
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('AccountNameUpdated');
    });

    it('should response 401 when token is invalid', async () => {
      const response = await putAccount(1, {}, '1231');
      expect(response.status).toBe(401);
    });

    it('should response 403 if the token is of Normal role', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await putAccount(1, {}, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 400 with errors if the values to update are invalid', async () => {
      const account = (await createAccounts(1))[0];
      const response = await putAccount(
        account.id,
        { name: true, clientName: null, responsibleName: 1213213 },
        token
      );
      expect(response.status).toBe(400);
      expect(Object.keys(response.body.errors)).toEqual([
        'name',
        'clientName',
        'responsibleName',
      ]);
    });

    it('should response 400 if the account not exist', async () => {
      const response = await putAccount(
        100,
        { name: 'Invalid account' },
        token
      );
      expect(response.status).toBe(400);
    });
  });
};

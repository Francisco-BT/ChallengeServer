const { getAuthToken, createAccounts } = require('./utils');

module.exports = (agent) => {
  let token;

  beforeEach(async () => {
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

  describe('DELETE - /api/v1/accounts/:id', () => {
    const deleteUser = async (id, token) => {
      return await agent
        .delete(`/api/v1/accounts/${id}`)
        .auth(token, { type: 'bearer' });
    };

    it('should response 204 if the account is deleted', async () => {
      const account = (await createAccounts(1))[0];
      const response = await deleteUser(account.id, token);
      expect(response.status).toBe(204);
    });

    it('should response 401 if there is no token', async () => {
      const response = await deleteUser(1, '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if the token is of Normal role', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await deleteUser(1, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 400 if the account not exists', async () => {
      const response = await deleteUser(100, token);
      expect(response.status).toBe(400);
    });
  });

  describe('GET - /api/v1/accounts/:id', () => {
    const getUser = async (id, token) => {
      return await agent
        .get(`/api/v1/accounts/${id}`)
        .auth(token, { type: 'bearer' });
    };

    it('should response 401 if there is no token', async () => {
      const response = await getUser(100, '');
      expect(response.status).toBe(401);
    });

    it('should response 403 if the token has Normal role', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await getUser(1, normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 400 if the account not exist', async () => {
      const response = await getUser(0, token);
      expect(response.status).toBe(400);
    });

    it('should response 200 if the account exist', async () => {
      const account = (await createAccounts(1))[0];
      const response = await getUser(account.id, token);
      expect(response.status).toBe(200);
    });

    it('should return the account data in the response.body', async () => {
      const account = (await createAccounts(1))[0];
      const response = await getUser(account.id, token);
      expect(response.body.id).toBe(account.id);
      expect(response.body.name).toBe(account.name);
      expect(response.body.clientName).toBe(account.clientName);
      expect(response.body.responsibleName).toBe(account.responsibleName);
      expect(response.body).not.toHaveProperty('createdAt');
    });
  });

  describe('GET - /api/v1/accounts', () => {
    const getAccounts = async (token, query = {}) => {
      return await agent
        .get('/api/v1/accounts')
        .query(query)
        .auth(token, { type: 'bearer' });
    };

    it('should response 401 if no token is provided', async () => {
      const response = await getAccounts('');
      expect(response.status).toBe(401);
    });

    it('should response 403 if the token has Normal role', async () => {
      const normalRoleToken = await getAuthToken(agent, 'Normal');
      const response = await getAccounts(normalRoleToken);
      expect(response.status).toBe(403);
    });

    it('should response 200 with empty array if there are no accounts', async () => {
      const response = await getAccounts(token);
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
    });

    it('should response just 10 items if req.query.limit has no value', async () => {
      await createAccounts(10);
      const response = await getAccounts(token);
      expect(response.body.items).toHaveLength(10);
    });

    it('should return a pagination object with total pages of 2', async () => {
      await createAccounts(15);
      const response = await getAccounts(token);
      expect(response.body.pagination.totalPages).toBe(2);
      expect(response.body.pagination.hasNext).toBeTruthy();
      expect(response.body.pagination.hasPrevious).toBeFalsy();
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBe(15);
    });

    it('should return 20 items if req.query.limit is 20', async () => {
      await createAccounts(20);
      const response = await getAccounts(token, { limit: 20 });
      expect(response.body.items).toHaveLength(20);
    });

    it('should return pagination values depending on limit and page provided in req.query', async () => {
      await createAccounts(25);
      const response = await getAccounts(token, { limit: 11, page: 2 });
      const pagination = response.body.pagination;
      expect(pagination.currentPage).toBe(2);
      expect(pagination.totalPages).toBe(3);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeTruthy();
      expect(pagination.limit).toBe(11);
      expect(pagination.total).toBe(25);
    });

    it('should use page 1 and limit 10 by default if values on req.params are invalid', async () => {
      await createAccounts(11);
      const response = await getAccounts(token, { limit: 1000000, page: -10 });
      const pagination = response.body.pagination;
      expect(response.body.items).toHaveLength(10);
      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(2);
    });

    it('should return an empty array of items if page in req.query is greater than totalPages', async () => {
      await createAccounts(5);
      const response = await getAccounts(token, { page: 200 });
      const pagination = response.body.pagination;
      expect(response.body.items).toHaveLength(0);
      expect(pagination.totalPages).toBe(1);
      expect(pagination.currentPage).toBe(200);
      expect(pagination.hasPrevious).toBeTruthy();
      expect(pagination.hasNext).toBeFalsy();
    });
  });
};

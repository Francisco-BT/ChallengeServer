const { Account } = require('../../src/models');
const { getAuthToken } = require('./utils');

module.exports = (agent) => {
  describe('POST - /api/v1/accounts', () => {
    beforeEach(async () => {
      await Account.sync({ force: true });
    });

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
      const token = await getAuthToken(agent, 'SuperAdmin');
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
      const token = await getAuthToken(agent, 'SuperAdmin');
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
  });
};

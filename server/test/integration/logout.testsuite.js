const { Token } = require('../../src/models');
const { getAuthToken } = require('./utils');

module.exports = (agent) => {
  describe('User LogOut', () => {
    const logOutRequest = async (token) => {
      return await agent
        .post('/api/v1/users/logout')
        .auth(token, { type: 'bearer' });
    };

    beforeEach(async () => {
      await Token.destroy({ force: true, truncate: true });
    });

    it('should response 401 if there is not auth token in the request', async () => {
      const response = await logOutRequest('');
      expect(response.status).toBe(401);
    });

    it('should request logout and remove the token from the DB', async () => {
      const token = await getAuthToken(agent);
      const response = await logOutRequest(token);
      const tokenInDb = await Token.findOne({ where: { token: token } });

      expect(response.status).toBe(200);
      expect(tokenInDb).toBeNull();
    });

    it('should response 401 if the token is removed and the user try to make a request with it', async () => {
      const token = await getAuthToken(agent);
      await logOutRequest(token);
      const response = await logOutRequest(token);

      expect(response.status).toBe(401);
    });
  });
};

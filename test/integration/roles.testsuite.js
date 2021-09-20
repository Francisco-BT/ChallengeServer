const { Role } = require('../../src/models');
const { getAuthToken } = require('./utils');

const roleTestsSuite = (agent) => {
  describe('Roles API V1', () => {
    describe('GET - /roles', () => {
      let token;
      beforeEach(async () => {
        await Role.destroy({ truncate: true, cascade: true });
        token = await getAuthToken(agent);
      });

      const requestRoles = async (token) => {
        return await agent.get('/api/v1/roles').auth(token, { type: 'bearer' });
      };

      it('should response 401 if there is no authentication token', async () => {
        const response = await requestRoles('');
        expect(response.status).toBe(401);
      });

      it('should returns 200 OK', async () => {
        const response = await requestRoles(token);
        expect(response.statusCode).toBe(200);
      });

      it('should returns an array of roles if there are in the db', async () => {
        await Role.bulkCreate([{ name: 'GOD' }, { name: 'Admin' }]);

        const response = await requestRoles(token);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'GOD' }),
            expect.objectContaining({ name: 'Admin' }),
          ])
        );
      });

      it('should returns 500 Internal server error when fails', async () => {
        const original = Role.findAll;
        Role.findAll = jest.fn().mockRejectedValue(new Error('DB Fail'));

        const response = await requestRoles(token);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error getting list of roles');
        Role.findAll = original;
      });

      it('should returns only id, name and description per role', async () => {
        await Role.create({ name: 'GOD', description: 'GOD role' });
        const response = await requestRoles(token);
        const sut = response.body[0];

        const properties = Object.keys(sut);
        expect(sut).toHaveProperty('id');
        expect(properties).toHaveLength(3);
        expect(properties.sort()).toEqual(['description', 'id', 'name']);
      });
    });
  });
};

module.exports = roleTestsSuite;

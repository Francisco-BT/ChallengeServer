const request = require('supertest');
const app = require('../../src/app');
const { Role } = require('../../src/models');
const { sequelize } = require('../../src/services');

afterAll(async () => await sequelize.close());

describe('Roles API V1', () => {
  describe('GET - /roles', () => {
    beforeEach(async () => {
      await Role.destroy({ truncate: true });
    });

    const requestRoles = async () => {
      return await request(app).get('/api/v1/roles');
    };

    it('should returns 200 OK', async () => {
      const response = await requestRoles();
      expect(response.statusCode).toBe(200);
    });

    it('should returns an empty array if there are no roles', async () => {
      const response = await requestRoles();
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(0);
    });

    it('should returns an array of roles if there are in the db', async () => {
      await Role.bulkCreate([{ name: 'GOD' }, { name: 'Admin' }]);

      const response = await requestRoles();
      expect(response.body).toHaveLength(2);
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

      const response = await requestRoles();
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Error getting list of roles');
      Role.findAll = original;
    });

    it('should returns only id, name and description per role', async () => {
      await Role.create({ name: 'GOD', description: 'GOD role' });
      const response = await requestRoles();
      const sut = response.body[0];

      const properties = Object.keys(sut);
      expect(sut).toHaveProperty('id');
      expect(properties).toHaveLength(3);
      expect(properties.sort()).toEqual(['description', 'id', 'name']);
    });
  });
});

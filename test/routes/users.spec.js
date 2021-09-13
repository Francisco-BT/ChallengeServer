const request = require('supertest');
const app = require('../../src/app');

describe('Users API', () => {
  describe.skip('POST - /api/v1/users', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'Francisco',
        email: 'fbernabe@test.com',
        password: 'test',
      };
      const response = await request(app).post('/api/v1/users').send(user);

      expect(response.status).toBe(201);
      expect(Object.keys(response.body)).toEqual([
        'id',
        'name',
        'email',
        'englishLevel',
        'technicalKnowledge',
        'cvLink',
      ]);
    });
  });
});

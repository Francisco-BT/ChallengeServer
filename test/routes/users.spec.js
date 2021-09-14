const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');

beforeAll(async () => {
  await User.sync({ force: true });
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

describe('Users API', () => {
  describe('POST - /api/v1/users', () => {
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

    it.skip('should not create a user with missing fields', async () => {
      const user = {
        name: 'Francisco',
        englishLevel: 'B2',
      };
      const response = await request(app).post('/api/v1/users').send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        'Email cannot be null and needs to have the format xxxx@xxxx.com',
        'Password cannot be null and needs to have 8 or more characters',
      ]);
    });
  });
});

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
    async function postUser(user) {
      return await request(app).post('/api/v1/users').send(user);
    }

    it('should create a new user with only name, email and password', async () => {
      const user = {
        name: 'Francisco',
        email: 'fbernabe@test.com',
        password: 'P4ssw0rd',
      };
      const response = await postUser(user);

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

    it('should not create a user with missing password, email or name', async () => {
      const response = await postUser({ englishLevel: 'B2' });
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toEqual(
        expect.objectContaining({ password: 'Password cannot be null' }),
        expect.objectContaining({ email: 'Email cannot be null' }),
        expect.objectContaining({ name: 'Name cannot be null' })
      );
    });
  });
});

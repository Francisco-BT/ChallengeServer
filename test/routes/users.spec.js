const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../src/models');

beforeAll(async () => {
  await User.sync({ force: true });
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
});

const createUsers = async (quantity) => {
  const users = [];
  for (let i = 0; i < quantity; i += 1) {
    const number = i + 1;
    users.push({
      name: `User ${number}`,
      email: `user${number}@mail.com`,
      password: 'P4ssword',
      englishLevel: 'A1',
      cvLink: 'www.google.com',
    });
  }

  await User.bulkCreate(users);
};

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

  describe('GET - /api/v1/users', () => {
    it('should return 200 with the list of users in the DB', async () => {
      await createUsers(5);
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(5);
    });

    it('should returns users with at least id, name, email', async () => {
      await createUsers(1);
      const response = await request(app).get('/api/v1/users');
      const user = response.body[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).not.toHaveProperty('createdAt');
      expect(user).not.toHaveProperty('password');
      expect(response.body).toHaveLength(1);
    });

    it('should return 500 - Internal Server Error with timestamp when an error happens', async () => {
      const originalFindAll = User.findAll;
      User.findAll = jest.fn().mockRejectedValueOnce(new Error());
      const currentTime = new Date().getTime();
      const response = await request(app).get('/api/v1/users');
      User.findAll = originalFindAll;

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
      expect(response.body.timestamp).toBeGreaterThan(currentTime);
    });
  });
});

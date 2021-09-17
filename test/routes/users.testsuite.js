const request = require('supertest');
const app = require('../../src/app');
const { User, Role } = require('../../src/models');
const { encrypt } = require('../../src/utils');
const { sequelize } = require('../../src/services');

const userTestsSuite = () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  beforeEach(async () => {
    await User.destroy({ truncate: true });
    await Role.destroy({ truncate: true, cascade: true });
  });

  const createUsers = async (quantity) => {
    const role = await Role.create({ name: 'Test' });
    const users = [];
    for (let i = 0; i < quantity; i += 1) {
      const number = i + 1;
      users.push({
        name: `User ${number}`,
        email: `user${number}@mail.com`,
        password: await encrypt(`User${number}`),
        englishLevel: 'A1',
        cvLink: 'www.google.com',
        roleId: role.id,
      });
    }

    const usersInDB = await User.bulkCreate(users);
    return usersInDB;
  };

  describe('Users API', () => {
    describe('POST - /api/v1/users', () => {
      async function postUser(user) {
        return await request(app).post('/api/v1/users').send(user);
      }

      const validUserData = {
        name: 'Francisco',
        email: 'fbernabe@test.com',
        password: 'P4ssw0rd',
      };

      it('should create a new user with only name, email, roleId and password', async () => {
        const role = await Role.create({ name: 'TestRole' });
        const response = await postUser({ ...validUserData, roleId: role.id });
        expect(response.status).toBe(201);
        expect(Object.keys(response.body)).toEqual([
          'id',
          'name',
          'email',
          'englishLevel',
          'technicalKnowledge',
          'cvLink',
          'role',
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

      it('should return 400 with errors if the role is SuperAdmin', async () => {
        const role = await Role.create({ name: 'SuperAdmin' });
        const response = await postUser({ ...validUserData, roleId: role.id });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.objectContaining({ roleId: 'Role is not valid' })
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

    describe('POST - /api/v1/users/auth', () => {
      beforeEach(async () => {
        await createUsers(1);
      });

      const postAuth = async (email, password) =>
        request(app).post('/api/v1/users/auth').send({ email, password });

      it('should return 200 with a JWT token when valid credentials', async () => {
        const response = await postAuth('user1@mail.com', 'User1');

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
      });

      it('should return 401 - Invalid Credentials if credentials are invalid', async () => {
        const response = await postAuth(
          'user1@mail.com',
          'This is no the right password'
        );

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid Credentials');
      });
    });

    describe('GET - /api/v1/users/:id', () => {
      const requestUserById = async (id) => {
        return await request(app).get(`/api/v1/users/${id}`);
      };

      it('should return a user by his id', async () => {
        const userInDB = (await createUsers(1))[0];
        const response = await requestUserById(userInDB.id);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(userInDB.id);
        expect(response.body.email).toBe(userInDB.email);
        expect(response.body.role).toBe('Test');
      });

      it('should response 400 - if the user id not exist', async () => {
        const response = await requestUserById(0);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Request');
      });
    });

    describe('DELETE - /api/v1/users/:id', () => {
      it('should delete a user if exits', async () => {
        const user = (await createUsers(2))[0];
        const response = await request(app).delete(`/api/v1/users/${user.id}`);
        const totalUsers = await User.count();

        expect(response.status).toBe(204);
        expect(totalUsers).toBe(1);
      });

      it('should responses 400 - Invalid request if the request is wrong', async () => {
        const response = await request(app).delete('/api/v1/users/0');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Request');
        expect(response.body).toHaveProperty('timestamp');
      });
    });
  });
};

module.exports = userTestsSuite;

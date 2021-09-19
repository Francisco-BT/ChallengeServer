const request = require('supertest');
const app = require('../../src/app');
const { User, Role } = require('../../src/models');
const { sequelize } = require('../../src/services');
const { createUsers, getAuthToken, getFakeToken } = require('./utils');

const userTestsSuite = () => {
  let authToken;
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  beforeEach(async () => {
    await User.destroy({ truncate: true });
    await Role.destroy({ truncate: true, cascade: true });
    authToken = await getAuthToken(request, app);
  });

  describe('Users API', () => {
    describe('POST - /api/v1/users', () => {
      async function postUser(user, token = authToken) {
        return await request(app)
          .post('/api/v1/users')
          .send(user)
          .auth(token, { type: 'bearer' });
      }

      const validUserData = {
        name: 'Francisco',
        email: 'fbernabe@test.com',
        password: 'P4ssw0rd',
      };

      it('should response 401 - Unhautorized if no token is provided', async () => {
        const response = await postUser({ id: 1 }, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but the user not exists', async () => {
        const fakeToken = getFakeToken();
        const response = await postUser({ id: 1 }, fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

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

    fdescribe('GET - /api/v1/users', () => {
      const requestUsers = async (token = authToken) => {
        return await request(app)
          .get('/api/v1/users')
          .auth(token, { type: 'bearer' });
      };

      it('should return 200 with the list of users in the DB', async () => {
        await createUsers(5, 'TestGetAll');
        const response = await requestUsers();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(5);
      });

      it('should returns users with at least id, name, email, role', async () => {
        await createUsers(1, 'TestGetAll');
        const response = await requestUsers();
        const user = response.body[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        // expect(user).toHaveProperty('role');
        expect(user).not.toHaveProperty('createdAt');
        expect(user).not.toHaveProperty('password');
      });

      it('should return 500 - Internal Server Error with timestamp when an error happens', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ id: 1 });
        jest.spyOn(User, 'findAll').mockRejectedValueOnce(new Error('This is an error'));
        const currentTime = new Date().getTime();
        const response = await requestUsers();

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

    describe('PUT - /api/v1/users/:id', () => {
      const putUSerRequest = async (id, payload = {}) => {
        return await request(app).put(`/api/v1/users/${id}`).send(payload);
      };

      it('should update the user name, englishLevel, cvLink and technicalKnowledfe', async () => {
        const user = (await createUsers(1))[0];
        const response = await putUSerRequest(user.id, {
          name: 'Updated Name',
          englishLevel: 'C2',
          cvLink: 'www.updatedcvlink.com',
          technicalKnowledge: 'Updated TK',
        });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(user.id);
        expect(response.body.name).toBe('Updated Name');
        expect(response.body.englishLevel).toBe('C2');
        expect(response.body.cvLink).toBe('www.updatedcvlink.com');
        expect(response.body.technicalKnowledge).toBe('Updated TK');
      });

      it('should respone 400 if no data is sending', async () => {
        const response = await putUSerRequest(1);
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.objectContaining({ body: 'There are no fields to update' })
        );
      });

      it('should no update fields that are do not have values provided', async () => {
        const user = (await createUsers(1))[0];
        const response = await putUSerRequest(user.id, {
          technicalKnowledge: 'Javascript',
          englishLevel: 'B1',
        });
        expect(response.body.name).toBe(user.name);
        expect(response.body.cvLink).toBe(user.cvLink);
        expect(response.body.englishLevel).toBe('B1');
        expect(response.body.technicalKnowledge).toBe('Javascript');
      });

      it('should response 400 - Invalid Request if user id is not valid', async () => {
        const response = await putUSerRequest(0, { englishLevel: 'B2' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Request');
      });
    });
  });
};

module.exports = userTestsSuite;

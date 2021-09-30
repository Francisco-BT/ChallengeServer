const { User, Role, Token } = require('../../src/models');
const { createUsers, getAuthToken, getFakeToken } = require('./utils');
const { generateToken } = require('../../src/utils');

const userTestsSuite = (agent) => {
  describe('Users API', () => {
    let authToken;
    afterAll(async () => {
      await User.destroy({ truncate: true, cascade: true });
      await Role.destroy({ truncate: true, cascade: true });
    });

    beforeEach(async () => {
      await User.destroy({ truncate: true, cascade: true });
      await Role.destroy({ truncate: true, cascade: true });
      authToken = await getAuthToken(agent);
    });

    describe('POST - /api/v1/users', () => {
      async function postUser(user, token = authToken) {
        return await agent
          .post('/api/v1/users')
          .send(user)
          .auth(token, { type: 'bearer' });
      }

      const validUserData = {
        name: 'Francisco',
        email: 'fbernabe@test.com',
        password: 'P4ssw0rd',
      };

      it('should response 401 - Unauthorized if no token is provided', async () => {
        const response = await postUser({ id: 1 }, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but not belong to the user that make the request', async () => {
        const anotherUser = (await createUsers(1))[0];
        const fakeToken = await getFakeToken(anotherUser.id);
        const response = await postUser({ id: 1 }, fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

      it('should response 403 - If role is Normal', async () => {
        const normalUserToken = await getAuthToken(agent, 'Normal');
        const response = await postUser({ id: 1 }, normalUserToken);
        expect(response.status).toBe(403);
      });

      it('should create a new user with only name, email, roleId and password if user role is Admin', async () => {
        const adminUserToken = await getAuthToken(agent, 'Admin');
        const role = await Role.create({ name: 'TestCreate' });
        const response = await postUser(
          { ...validUserData, roleId: role.id },
          adminUserToken
        );
        expect(response.status).toBe(201);
        expect(Object.keys(response.body)).toEqual([
          'id',
          'name',
          'email',
          'englishLevel',
          'technicalKnowledge',
          'cvLink',
          'role',
          'roleId',
        ]);
      });

      it('should create a new user with only name, email, roleId and password if user role is SuperAdmin', async () => {
        const role = await Role.create({ name: 'TestCreate' });
        const response = await postUser({ ...validUserData, roleId: role.id });
        expect(response.status).toBe(201);
      });

      it('should not create a user with missing password, email or name', async () => {
        const response = await postUser({ englishLevel: 'B2' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toEqual(
          expect.objectContaining({ password: 'Password cannot be empty' }),
          expect.objectContaining({ email: 'Email cannot be empty' }),
          expect.objectContaining({ name: 'Name cannot be empty' })
        );
      });

      it('should return 400 with errors if the role is SuperAdmin', async () => {
        let role;
        const superAdminInDb = await Role.findOne({
          where: { name: 'SuperAdmin' },
        });
        role = superAdminInDb
          ? superAdminInDb
          : await Role.create({ name: 'SuperAdmin' });
        const response = await postUser({ ...validUserData, roleId: role.id });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
          expect.objectContaining({ roleId: 'Role is not valid' })
        );
      });
    });

    describe('GET - /api/v1/users', () => {
      const requestUsers = async (token = authToken, query = {}) => {
        return await agent
          .get('/api/v1/users')
          .auth(token, { type: 'bearer' })
          .query(query);
      };

      it('should response 403 if the request comes from a normal user', async () => {
        const normalToken = await getAuthToken(agent, 'Normal');
        const response = await requestUsers(normalToken);

        expect(response.status).toBe(403);
      });

      it('should response 401 - Unauthorized if no token is provided', async () => {
        const response = await requestUsers({ id: 1 }, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but not belong to the user that make the request', async () => {
        const anotherUser = (await createUsers(1))[0];
        const fakeToken = await getFakeToken(anotherUser.id);
        const response = await requestUsers(fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

      it('should return 200 with the list of users in the DB', async () => {
        await createUsers(5, 'TestGetAll');
        const response = await requestUsers();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.items)).toBeTruthy();
        expect(response.body.items.length).toBeGreaterThanOrEqual(5);
      });

      it('should returns users with at least id, name, email, role', async () => {
        await createUsers(1, 'TestGetAll');
        const response = await requestUsers();
        const user = response.body.items[1];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('role');
        expect(user.role).toBe('TestGetAll');
        expect(user).not.toHaveProperty('createdAt');
        expect(user).not.toHaveProperty('password');
      });

      it('should return 500 - Internal Server Error with timestamp when an error happens', async () => {
        jest
          .spyOn(User, 'findByPk')
          .mockResolvedValueOnce({ id: 1, role: { name: 'SuperAdmin' } });
        jest
          .spyOn(User, 'findAll')
          .mockRejectedValueOnce(new Error('This is an error'));
        const currentTime = new Date().getTime();
        const response = await requestUsers();

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.timestamp).toBeGreaterThan(currentTime);
      });

      it('should return a pagination object in the response', async () => {
        const response = await requestUsers();
        expect(response.body.pagination).toBeDefined();
        expect(Object.keys(response.body.pagination)).toEqual([
          'totalPages',
          'limit',
          'hasNext',
          'hasPrevious',
          'currentPage',
          'total',
        ]);
      });

      it('should return a pagination with override values depending on req.query values', async () => {
        await createUsers(40);
        const response = await requestUsers(authToken, { limit: 15, page: 2 });
        const pagination = response.body.pagination;
        expect(pagination.totalPages).toBe(3);
        expect(pagination.limit).toBe(15);
        expect(pagination.hasNext).toBeTruthy();
        expect(pagination.hasPrevious).toBeTruthy();
      });
    });

    describe('POST - /api/v1/users/auth', () => {
      beforeEach(async () => {
        await createUsers(1);
      });

      const postAuth = async (email, password) =>
        await agent.post('/api/v1/users/auth').send({ email, password });

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
      const requestUserById = async (id, token = authToken) => {
        return await agent
          .get(`/api/v1/users/${id}`)
          .auth(token, { type: 'bearer' });
      };

      it('should response 401 if there is not token', async () => {
        const response = await requestUserById(1, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but not belong to the user that make the request and the user Role is Normal', async () => {
        const anotherUser = (await createUsers(1))[0];
        const fakeToken = await getFakeToken(anotherUser.id);
        const response = await requestUserById(1, fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

      it('should response 403 - if the token user role is not an Admin, SuperAdmin or Normal', async () => {
        const invalidRoleToken = await getAuthToken(agent, 'RoleNotValid');
        const tokenInDb = await Token.findOne({
          where: { token: invalidRoleToken },
        });
        const response = await requestUserById(
          tokenInDb.userId,
          invalidRoleToken
        );
        expect(response.status).toBe(403);
      });

      it('should return a user by his id', async () => {
        const userInDB = (await createUsers(1))[0];
        const response = await requestUserById(userInDB.id);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(userInDB.id);
        expect(response.body.email).toBe(userInDB.email);
        expect(response.body.role).toBe('Normal');
      });

      it('should response 400 - if the user id not exist', async () => {
        const response = await requestUserById(0);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Request');
      });
    });

    describe('DELETE - /api/v1/users/:id', () => {
      const requestDelete = async (id, token = authToken) => {
        return await agent
          .delete(`/api/v1/users/${id}`)
          .auth(token, { type: 'bearer' });
      };

      it('should response 403 if the user that make the request has a normal role', async () => {
        const normalRoleToken = await getAuthToken(agent, 'Normal');
        const response = await requestDelete(1, normalRoleToken);
        expect(response.status).toBe(403);
      });

      it('should response 401 if there is not token', async () => {
        const response = await requestDelete(1, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but not belong to the user that make the request', async () => {
        const anotherUser = (await createUsers(1))[0];
        const fakeToken = await getFakeToken(anotherUser.id);
        const response = await requestDelete(1, fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

      it('should delete a user if exits', async () => {
        const user = (await createUsers(2))[0];
        const response = await requestDelete(user.id);

        const isInDb = await User.findByPk(user.id);
        expect(response.status).toBe(204);
        expect(isInDb).toBeFalsy();
      });

      it('should responses 400 - Invalid request if the request is wrong', async () => {
        const response = await requestDelete(0);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Request');
        expect(response.body).toHaveProperty('timestamp');
      });

      it('should remove all the tokens belonging to the user deleted', async () => {
        const user = (await createUsers(1))[0];
        await generateToken({ id: user.id });
        await generateToken({ id: user.id });
        await generateToken({ id: user.id });
        const response = await requestDelete(user.id);
        const tokens = await Token.findAll({ where: { userId: user.id } });

        expect(response.status).toBe(204);
        expect(tokens).toHaveLength(0);
      });
    });

    describe('PUT - /api/v1/users/:id', () => {
      const putUSerRequest = async (id, payload = {}, token = authToken) => {
        return await agent
          .put(`/api/v1/users/${id}`)
          .send(payload)
          .auth(token, { type: 'bearer' });
      };

      it('should response 403 if the user that make the request has role Normal', async () => {
        const normalRoleToken = await getAuthToken(agent, 'Normal');
        const response = await putUSerRequest(1, {}, normalRoleToken);

        expect(response.status).toBe(403);
      });

      it('should response 401 if there is not token', async () => {
        const response = await putUSerRequest(1, {}, '');
        expect(response.status).toBe(401);
      });

      it('should response 403 - if the token is correct but not belong to the user that make the request', async () => {
        const anotherUser = (await createUsers(1))[0];
        const fakeToken = await getFakeToken(anotherUser.id);
        const response = await putUSerRequest(1, {}, fakeToken);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not able to access to the resource'
        );
      });

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

      it('should response 400 if no data is sending', async () => {
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

      it('should return 422 if the user has not change', async () => {
        const user = (await createUsers(1))[0];
        const response = await putUSerRequest(user.id, {
          ...user,
        });
        expect(response.status).toBe(422);
        expect(response.body.message).toBe('The data has not change');
      });
    });
  });
};

module.exports = userTestsSuite;

const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/services');
const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const publicTestsSuite = require('./public.testsuite');
const logOutTestsSuite = require('./logout.testsuite');

// Run test in sequence to prevent race conditions cleaning up the DB
describe('Integration Test', () => {
  const agent = request(app);

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  publicTestsSuite(agent);
  roleTestsSuite(agent);
  userTestsSuite(agent);
  logOutTestsSuite(agent);
});

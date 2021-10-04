const request = require('supertest');
const app = require('../../src/app');

const { sequelize } = require('../../src/services');
const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const logOutTestsSuite = require('./logout.testsuite');
const accountTestSuite = require('./account.testsuite');
const teamTestSuite = require('./teams.testsuite');

// Run test in sequence to prevent race conditions cleaning up the DB
describe('Integration Test', () => {
  const agent = request(app);

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  roleTestsSuite(agent);
  userTestsSuite(agent);
  logOutTestsSuite(agent);
  accountTestSuite(agent);
  teamTestSuite(agent);
});

const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const publicTestsSuite = require('./public.testsuite');

describe('Integration Test', () => {
  publicTestsSuite();
  roleTestsSuite();
  userTestsSuite();
});

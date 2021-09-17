const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const publicTestsSuite = require('./public.testsuite');

describe('Integration tests', () => {
    publicTestsSuite();
    roleTestsSuite();
    userTestsSuite();
})
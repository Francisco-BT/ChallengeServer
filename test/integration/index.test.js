const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const publicTestsSuite = require('./public.testsuite');

// Run test in sequence to prevent race conditions cleaning up the DB
publicTestsSuite();
roleTestsSuite();
userTestsSuite();

module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/client/'],
  verbose: false,
  testEnvironment: 'node',
};

beforeEach(() => jest.resetModules());

describe('Config module', () => {
  it('should set undefined to all the env variables is there is not a .env file for the environment', () => {
    process.env.NODE_ENV = 'unknown';
    expect(process.env.PORT).not.toBeDefined();
    expect(process.env.POSTGRES_CONNECTION_STRING).not.toBeDefined();
  });

  it(`should set default values to config if the environment .env file doesn't exist`, () => {
    process.env.NODE_ENV = 'unknown';
    const config = require('../../src/config');
    expect(config.PORT).toBe(3000);
    expect(config.POSTGRES_CONNECTION_STRING).toBe('undefined');
  });

  it('should use a .env file depending on the environment', () => {
    process.env.NODE_ENV = 'test';
    const config = require('../../src/config');
    expect(config.PORT).toBe(parseInt(process.env.PORT, 10));
  });
});

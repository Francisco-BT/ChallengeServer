const { generateToken } = require('../../src/utils');

describe('Token Utilities', () => {
  describe('Generate Token', () => {
    it('should have a generateToken function', () => {
      expect(typeof generateToken).toBe('function');
    });

    it('should return a jwt token', () => {
      const token = generateToken({ test: true });
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
});

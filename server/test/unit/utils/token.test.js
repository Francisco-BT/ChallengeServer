const { TokenGenerationException } = require('../../../src/utils/errors');
const { generateToken } = require('../../../src/utils');

describe('Token Utilities', () => {
  describe('Generate Token', () => {
    const mockTokenModel = { create: jest.fn() };
    const payload = { id: 1 };

    it('should have a generateToken function', () => {
      expect(typeof generateToken).toBe('function');
    });

    it('should return a jwt token', async () => {
      const token = await generateToken(payload, mockTokenModel);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should call model.create to store the token and userId', async () => {
      const token = await generateToken(payload, mockTokenModel);
      expect(mockTokenModel.create).toHaveBeenCalledWith({
        token,
        userId: 1,
      });
    });

    it('should throws a TokenGenerationException if the payload does not have and id', async () => {
      expect.assertions(1);
      try {
        await generateToken({ test: true }, mockTokenModel);
      } catch (error) {
        expect(error).toEqual(new TokenGenerationException());
      }
    });

    it('should throws an error if something went wrong saving the token', async () => {
      expect.assertions(1);
      mockTokenModel.create = jest
        .fn()
        .mockRejectedValueOnce(new Error('Something went wrong'));
      try {
        await generateToken(payload, mockTokenModel);
      } catch (e) {
        expect(e).toEqual(new TokenGenerationException());
      }
    });
  });
});

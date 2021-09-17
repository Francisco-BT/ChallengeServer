const { encrypt, compareEncrypted } = require('../../src/utils');
const { EncryptException } = require('../../src/utils/errors');

describe('Fields utils', () => {
  describe('Encrypt text util', () => {
    it('should have an encrypt function', () => {
      expect(typeof encrypt).toBe('function');
    });

    it('should return the string received as argument encrypted', async () => {
      const encrypted = await encrypt('some text');
      expect(encrypt).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe('some text');
    });

    it('should throws an EncryptException when fail', async () => {
      try {
        const mockBcrypt = {
          hash: jest.fn().mockRejectedValueOnce(new Error()),
        };
        await encrypt('example', mockBcrypt);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof EncryptException).toBeTruthy();
      }
    });
  });

  describe('Compared encrypted text', () => {
    it('should have a compareEncrypted function', () => {
      expect(typeof compareEncrypted).toBe('function');
    });

    it('should called the compare function using the text and encrypted params', () => {
      const text = 'text';
      const encrypted = 'encrypted';
      const bcryptMock = { compare: jest.fn() };
      compareEncrypted(text, encrypted, bcryptMock);
      expect(bcryptMock.compare).toHaveBeenCalled();
      expect(bcryptMock.compare).toHaveBeenCalledWith('text', 'encrypted');
    });

    it('should returns true if the text and encrypted params match', async () => {
      const text = 'some text';
      const encrypted = await encrypt(text);
      const isValid = await compareEncrypted(text, encrypted);

      expect(isValid).toBeTruthy();
    });

    it('should returns false if the text and encrypted params dont match', async () => {
      expect(await compareEncrypted('', 'different')).toBeFalsy();
    });

    it('should return false if an exception ocurred', async () => {
      const bcryptMock = {
        compare: jest.fn().mockRejectedValueOnce(new Error()),
      };
      expect(await compareEncrypted('', '', bcryptMock)).toBeFalsy();
    });
  });
});

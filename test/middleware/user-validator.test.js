const { createRequest, createResponse } = require('node-mocks-http');
const { newUserValidator } = require('../../src/middlewares');
const { ValidationsException } = require('../../src/utils/errors');

let next = jest.fn(),
  req = createRequest(),
  res = createResponse();
beforeEach(() => {
  next = jest.fn();
  req = createRequest();
  res = createResponse();
});

const invokeMiddlewares = async (middlewares) => {
  const validations = middlewares;
  const totalValidations = validations.length;
  const validateMiddleware = validations[totalValidations - 1];
  await Promise.all(
    validations
      .slice(0, totalValidations - 1)
      .map(async (middleware) => await middleware(req, res, () => undefined))
  );
  await validateMiddleware(req, res, next);
};

describe('User Validators Middleware', () => {
  describe('New User Middleware Validator', () => {
    it('should have a newUserValidator function', () => {
      expect(typeof newUserValidator).toBe('function');
    });

    it.each([
      { field: 'name', value: null, expectedMessage: 'Name cannot be null' },
      {
        field: 'name',
        value: '1231231',
        expectedMessage:
          'Name cannot contain numbers or special characters just .',
      },
      {
        field: 'name',
        value: 'User12 Rodriguez',
        expectedMessage:
          'Name cannot contain numbers or special characters just .',
      },
      {
        field: 'name',
        value: 'User$ With special ch$ract#rs',
        expectedMessage:
          'Name cannot contain numbers or special characters just .',
      },
      { field: 'email', value: null, expectedMessage: 'Email cannot be null' },
      {
        field: 'email',
        value: 'noemail',
        expectedMessage: 'Email format is wrong',
      },
      {
        field: 'email',
        value: 'fake.com',
        expectedMessage: 'Email format is wrong',
      },
      {
        field: 'email',
        value: 'fake_-asda@me',
        expectedMessage: 'Email format is wrong',
      },
      {
        field: 'email',
        value: '@test.com',
        expectedMessage: 'Email format is wrong',
      },
      {
        field: 'password',
        value: null,
        expectedMessage: 'Password cannot be null',
      },
      {
        field: 'password',
        value: 'ada',
        expectedMessage: 'Password must have at least 8 characters',
      },
      {
        field: 'password',
        value: 'alllower',
        expectedMessage:
          'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'ALLUPPER',
        expectedMessage:
          'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: '123123123',
        expectedMessage:
          'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'UPPERNUMBER3',
        expectedMessage:
          'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'lowernumber3',
        expectedMessage:
          'Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number',
      },
      {
        field: 'englishLevel',
        value: 'Advanced',
        expectedMessage:
          'English Level must be either (A1, A2, B1, B2, C1, C2)',
      },
      {
        field: 'cvLink',
        value: 'testlink',
        expectedMessage: 'CV Link must have an URL format',
      },
      {
        field: 'cvLink',
        value: 'https://test',
        expectedMessage: 'CV Link must have an URL format',
      },
      {
        field: 'cvLink',
        value: 'http://test',
        expectedMessage: 'CV Link must have an URL format',
      },
      {
        field: 'roleId',
        value: null,
        expectedMessage: 'Role cannot be null'
      },
      {
        field: 'roleId',
        value: 'asdasda',
        expectedMessage: 'Role is not valid'
      },
      {
        field: 'roleId',
        value: -1,
        expectedMessage: 'Role is not valid'
      },
      {
        field: 'roleId',
        value: 0,
        expectedMessage: 'Role is not valid'
      }
    ])(
      `should call next with ValidationsException with $expectedMessage if $field is $value`,
      async ({ field, value, expectedMessage }) => {
        req.body[field] = value;
        await invokeMiddlewares(newUserValidator());

        const errors = next.mock.calls[0][0].errors;
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationsException());
        expect(errors[field]).toBe(expectedMessage);
      }
    );

    it('should call next without args if name, password, role and email are correct', async () => {
      req.body = {
        name: 'Francisco Bernabe',
        email: 'francisco@me.com',
        password: 'P4ssw0rd',
        roleId: 2
      };
      await invokeMiddlewares(newUserValidator());

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });
  });
});

module.exports = (message400 = 'The body has invalid values') => ({
  400: {
    description: message400,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
      },
    },
  },
  401: {
    description: 'Auth token is not valid',
  },
  403: {
    description: 'Auth token has not enough permissions',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
      },
    },
  },
  '5xx': {
    description: 'Unexpected error',
  },
});

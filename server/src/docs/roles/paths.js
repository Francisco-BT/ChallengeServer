const errorResponses = require('../error-responses');
module.exports = {
  '/api/v1/roles': {
    get: {
      tags: ['Roles V1'],
      summary: 'Get roles',
      description: 'Get the list of the current valid roles',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Returns the list of roles',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Role',
                },
              },
            },
          },
        },
        ...errorResponses(),
        400: undefined,
      },
    },
  },
};

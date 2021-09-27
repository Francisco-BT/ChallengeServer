const errorResponses = require('../error-responses');
module.exports = {
  '/api/v1/users/auth': {
    post: {
      tags: ['Authentication'],
      summary: 'Authentication a user',
      description:
        'Validate if the credentials of the user are valid and returns an auth token',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Credentials',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'The credentials are correct',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    $ref: '#/components/schemas/Id',
                  },
                  name: {
                    type: 'string',
                  },
                  token: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
        },
        500: {
          description: 'Unexpected error',
        },
      },
    },
  },
  '/api/v1/users': {
    get: {
      tags: ['Users V1'],
      summary: 'Get users',
      description: 'Get all the users of the API',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/PaginationPage',
          },
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/PaginationLimit',
          },
        },
      ],
      responses: {
        200: {
          description: 'The list of users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                  pagination: {
                    type: 'object',
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        ...errorResponses(),
        400: undefined,
      },
    },
    post: {
      tags: ['Users V1'],
      summary: 'Create User',
      description: 'Create a new user',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/NewUserInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'The user was created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        ...errorResponses(),
        409: {
          description: 'The email is already taken',
        },
      },
    },
  },
  '/api/v1/users/{id}': {
    put: {
      tags: ['Users V1'],
      summary: 'Update User',
      description: 'Update the fields of a user email cannot be updated',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateUserInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'The user was updated successfully',
        },
        ...errorResponses(),
      },
    },
    delete: {
      tags: ['Users V1'],
      summary: 'Delete User',
      description: 'Delete completely the user from the API',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      responses: {
        204: {
          description: 'The user was deleted successfully',
        },
        ...errorResponses('The id is not valid'),
      },
    },
    get: {
      tags: ['Users V1'],
      summary: 'Get one user',
      description: 'Get the data of one user using its id',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      responses: {
        200: {
          description: 'The user was deleted successfully',
          content: {
            'application/json': {
              schema: { ref: '#/components/schemas/User' },
            },
          },
        },
        ...errorResponses('The id is not valid'),
      },
    },
  },
  '/api/v1/users/logout': {
    post: {
      tags: ['Users V1'],
      summary: 'Log out an user',
      description: 'Invalidate the token to make it unusable',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'The token was invalidated',
        },
        500: {
          description: 'Unexpected error',
        },
      },
    },
  },
};

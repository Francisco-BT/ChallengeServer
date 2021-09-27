const errorResponses = require('../error-responses');
module.exports = {
  '/api/v1/accounts': {
    get: {
      tags: ['Accounts V1'],
      summary: 'List of accounts',
      description: 'Returns the list of account paginated',
      security: [{ bearerAuth: [] }],
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
          description: 'The list of accounts',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Account',
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
      tags: ['Accounts V1'],
      summary: 'Create account',
      description: 'Create a new account',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AccountInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Account created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Account',
              },
            },
          },
        },
        409: {
          description: 'Account already exists',
        },
        ...errorResponses(),
      },
    },
  },
  '/api/v1/accounts/{id}': {
    put: {
      tags: ['Accounts V1'],
      summary: 'Update account',
      description: 'Update the fields of one account',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AccountInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Account updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Account',
              },
            },
          },
        },
        ...errorResponses(),
      },
    },
    delete: {
      tags: ['Accounts V1'],
      summary: 'Delete Account',
      description: 'Delete an account permanently',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      responses: {
        204: {
          description: 'Account deleted successfully',
        },
        ...errorResponses('Invalid account id'),
      },
    },
    get: {
      tags: ['Accounts V1'],
      summary: 'Create account',
      description: 'Create a new account',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AccountInput',
            },
          },
        },
      },
      parameters: [{ $ref: '#/components/schemas/IdParam' }],
      responses: {
        200: {
          description: 'Account requested',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Account',
              },
            },
          },
        },
        ...errorResponses(),
      },
    },
  },
};

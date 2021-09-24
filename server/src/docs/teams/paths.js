const errorResponses = require('../error-responses');
module.exports = {
  '/api/v1/teams': {
    post: {
      tags: ['Teams V1'],
      summary: 'Create Team',
      description: 'Create a new team using an account and array of members',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/TeamInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Team created successfully',
        },
        ...errorResponses(),
      },
    },
    get: {
      tags: ['Teams V1'],
      summary: 'Get teams movements',
      description: 'Get the history of members movements between teams',
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
        {
          name: 'accountName',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'userName',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'startDate',
          in: 'query',
          schema: {
            type: 'string',
            format: 'date',
          },
          example: '2021-09-10',
        },
        {
          name: 'endDate',
          in: 'query',
          schema: {
            type: 'string',
            format: 'date',
          },
          example: '2021-09-10',
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TeamMovement',
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
      },
    },
  },
  '/api/v1/teams/{accountId}/{userId}': {
    delete: {
      tags: ['Teams V1'],
      summary: 'Delete Team Member',
      description: 'Delete a user from a team',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'accountId',
          in: 'path',
          schema: {
            $ref: '#/components/schemas/Id',
          },
          required: true,
        },
        {
          name: 'userId',
          in: 'path',
          schema: {
            $ref: '#/components/schemas/Id',
          },
          required: true,
        },
      ],
      responses: {
        204: {
          description: 'Team Member successfully deleted',
        },
        ...errorResponses(),
      },
    },
    put: {
      tags: ['Teams V1'],
      summary: 'Update Team Member',
      description: 'Assign team member to another team if exists',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'accountId',
          in: 'path',
          schema: {
            $ref: '#/components/schemas/Id',
          },
          required: true,
        },
        {
          name: 'userId',
          in: 'path',
          schema: {
            $ref: '#/components/schemas/Id',
          },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['newAccountId'],
              properties: {
                newAccountId: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Team Member updated successfully',
        },
        ...errorResponses(),
      },
    },
  },
};
